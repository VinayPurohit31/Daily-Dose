import moment from "moment"

export const FormatDate=(timestamp)=>{
    return new Date(timestamp).setHours(0,0,0,0)
}
export const formatDateForText=(date)=>{
    return moment (date).format('L')
}
export const convertToTime = (timestamp) => {
    if (!timestamp) return "Select Time";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // Ensures AM/PM is displayed
    });
};
