import dayjs from "dayjs";

export const formatDayDDMMYYYY = (text: string)=> {
    if(!text) return "NaN"
    return dayjs(text).format("DD/MM/YYYY")
}