import moment from "moment"

export const FormatDate = (timestamp) => {
    return new Date(timestamp)
}
export const formatDateForText = (date) => {
    return moment(date).format('L')
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

export const getDatesRange=(startdate,endDate)=>{
    const start=moment(new Date(startdate),'MM/DD/YYYY');
    const end=moment(new Date(endDate),'MM/DD/YYYY');
    const dates=[];

    while(start.isSameOrBefore(end)){
        dates.push(start.format('MM/DD/YYYY'));
        start.add(1,'days')
    }
    return dates;


}

export const GetDateRangeToDisplay=()=>{
    const dateList=[];
    for(let i=0;i<=7;i++){
        dateList.push({
            date:moment().add(i,'days').format('DD'),
            day:moment().add(i,'days').format('dd'),
            formatedDate:moment().add(i,'days').format('L')
        })
        
    }
    return dateList;
}