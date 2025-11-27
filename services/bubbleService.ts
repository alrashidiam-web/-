
// DEPRECATED: This service has been replaced by supabaseService.ts
// Keeping file structure to prevent import errors during transition, but functions are disabled.

export const getReports = async () => {
    console.warn("Legacy bubbleService.getReports called. Please migrate to supabaseService.");
    return [];
};

export const createReport = async (data: any) => {
    console.warn("Legacy bubbleService.createReport called. Please migrate to supabaseService.");
    return { ...data, id: 'legacy-mock-id', date: new Date().toISOString() };
};

export const deleteReport = async (id: string) => {
    console.warn("Legacy bubbleService.deleteReport called. Please migrate to supabaseService.");
};

export const submitFeedback = async (id: string, rating: number, comment: string) => {
    console.warn("Legacy bubbleService.submitFeedback called. Please migrate to supabaseService.");
};
