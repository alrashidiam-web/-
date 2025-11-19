import type { SavedReport, BusinessData } from '../types';

// Use environment variables for the Bubble app name and API token for security and flexibility.
const BUBBLE_APP_NAME = process.env.BUBBLE_APP_NAME;
const BUBBLE_API_TOKEN = process.env.BUBBLE_API_TOKEN;

const isBubbleConfigured = BUBBLE_APP_NAME && BUBBLE_API_TOKEN;

// Log a warning if configuration is incomplete and disable the service.
if (!isBubbleConfigured) {
    console.warn("Bubble environment variables (BUBBLE_APP_NAME, BUBBLE_API_TOKEN) are not fully set. Bubble service is disabled. Reports will not be saved or loaded from the cloud.");
}

const BUBBLE_API_ROOT = isBubbleConfigured ? `https://${BUBBLE_APP_NAME}.bubbleapps.io/version-test/api/1.1/obj` : null;
const REPORT_API_ENDPOINT = BUBBLE_API_ROOT ? `${BUBBLE_API_ROOT}/report` : null; // Assuming your data type is named "report"

interface BubbleReport {
    _id: string;
    'Created Date': string;
    organizationName: string;
    analysis: string;
    businessData: string; // Stored as a JSON string in Bubble
}

// Maps a report from Bubble's format to our app's format
const mapBubbleReportToSavedReport = (bubbleReport: BubbleReport): SavedReport => {
    try {
        const businessData: BusinessData = JSON.parse(bubbleReport.businessData || '{}');
        return {
            id: bubbleReport._id,
            date: bubbleReport['Created Date'],
            organizationName: bubbleReport.organizationName,
            analysis: bubbleReport.analysis,
            businessData: businessData,
        };
    } catch (e) {
        console.error("Failed to parse businessData from Bubble report:", e, bubbleReport);
        // Return a default/empty structure if parsing fails
        return {
            id: bubbleReport._id,
            date: bubbleReport['Created Date'],
            organizationName: "Error: Invalid Data",
            analysis: "Could not load analysis content.",
            businessData: {} as BusinessData
        }
    }
};

const getAuthHeaders = () => ({
    'Authorization': `Bearer ${BUBBLE_API_TOKEN}`,
});

// Fetches all reports for the currently logged-in user
export const getReports = async (): Promise<SavedReport[]> => {
    if (!isBubbleConfigured || !REPORT_API_ENDPOINT) return [];

    const response = await fetch(REPORT_API_ENDPOINT, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Bubble API Error: Failed to fetch reports. Status: ${response.status}. Details: ${errorText}`);
    }

    const data = await response.json();
    if (data.response && Array.isArray(data.response.results)) {
        return data.response.results.map(mapBubbleReportToSavedReport);
    }

    return [];
};

// Creates a new report in Bubble
type NewReportData = Omit<SavedReport, 'id' | 'date'>;

export const createReport = async (reportData: NewReportData): Promise<SavedReport> => {
    if (!isBubbleConfigured || !REPORT_API_ENDPOINT) {
        console.warn("Bubble service is not configured. Report will not be saved to the cloud.");
        // Return a mock response to allow the app to continue functioning without a backend.
        return {
          ...reportData,
          id: `local-${Date.now()}`,
          date: new Date().toISOString(),
        };
    }
    
    const payload = {
        organizationName: reportData.organizationName,
        analysis: reportData.analysis,
        // Bubble expects complex objects to be sent as a string
        businessData: JSON.stringify(reportData.businessData),
    };

    const response = await fetch(REPORT_API_ENDPOINT, {
        method: 'POST',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Bubble API Error: Failed to create report. Status: ${response.status}. Details: ${errorText}`);
    }

    const { id } = await response.json();
    
    // To provide immediate feedback, we optimistically create the SavedReport object
    // In a production app, you might re-fetch the created object to get all fields like "Created Date"
    return {
      ...reportData,
      id: id,
      date: new Date().toISOString(),
    };
};

// Deletes a report from Bubble by its ID
export const deleteReport = async (reportId: string): Promise<void> => {
    if (!isBubbleConfigured || !REPORT_API_ENDPOINT || reportId.startsWith('local-')) {
        console.warn("Bubble service is not configured or report is local. Report cannot be deleted from the cloud.");
        return; // Gracefully handle disabled service or local-only reports
    }

    const response = await fetch(`${REPORT_API_ENDPOINT}/${reportId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Bubble API Error: Failed to delete report. Status: ${response.status}. Details: ${errorText}`);
    }
};
