import { start } from "repl";

class Holidays {
    consecutive_days: number;
    business_days: number;
    year: string;

    constructor(year: string, consecutive: number, business: number) {
        this.year = year;
        this.consecutive_days = consecutive;
        this.business_days = business;
    }
}

class RequestHolidays {
    // start_day and end_day in Unix time format
    start_day: Date;
    end_day: Date;
    no_labor_days: number;    
    url_task: string;
    holiday_year: string;
    total_days: number;
    
    constructor(start_day: number, end_day: number, no_labor_days: number, 
        url_task: string, holiday_year: string) {
        this.start_day = new Date(start_day);
        this.end_day = new Date(end_day);
        this.no_labor_days = no_labor_days;
        this.url_task = url_task;
        this.holiday_year = holiday_year;
        this.total_days = this.get_total_days();
    }

    // calculate total requested holidays
    // must include saturday and sunday ...
    get_total_days = () => {        
        let partial_dates = getDifferenceInDays(this.end_day, this.start_day);
        if (partial_dates === 0) { partial_dates = +1; };
        return (partial_dates - this.no_labor_days)
    }
}

function getDifferenceInDays(date1:any, date2:any) {
    const diffInMs = Math.abs(date1 - date2);
    return diffInMs / (1000 * 60 * 60 * 24);
}

// Get Available Holidays from ClickUp - Licencias folder - Dias disponibles list
export function get_holidays(tasks: any) 
{
    let list:Array<Holidays> = [];
    let year_holiday_list;  

    tasks.forEach((obj: { [s: string]: unknown; } | ArrayLike<unknown>) => 
    {
        Object.entries(obj).forEach(([key, value]) => 
        {            
            // if custom_fields then is an Array in 'value'
            // so i need to find the key = 'Dias habiles' and 'Dias corridos'
            // and get the value of them (year vacation days) - only 1 year (1 record)
            if (key === 'custom_fields') 
            {
                let year_holiday_list = get_custom_fields_days(value);
                if (year_holiday_list) {
                    list.push(year_holiday_list);
                }
            }               
        })        
    });    
    return list;
}

// Assigned Holidays - iterate over 'custom fields' array in clickup tasks list
// to retrieve consecutive and business days
function get_custom_fields_days(data: any) {
    let descrip: string="";
    let cons_days: number=0;
    let buss_days: number=0;
    let holi_year: number=0;

    data.forEach((custom_obj: { [s: string]: unknown; } | ArrayLike<unknown>) => 
    {
        Object.entries(custom_obj).forEach(([key, value]) => 
        { 
            if (key === 'name' && value === 'Fecha de pago') {
                //console.log(`${key} ${value}`);
                descrip = value;
            }                      
            if (key === 'name' && (value === 'Días corridos' || value === 'Días hábiles')) {
                //console.log(`${key} ${value}`);
                descrip = value;
            }
            if (key === 'value' && typeof value === "string" ) {
                //console.log(`${key} ${value}`);
                
                if (parseInt(value) <= 30) {
                    if (descrip === 'Días corridos') {
                        cons_days = parseInt(value);
                    }
                    if (descrip === 'Días hábiles') {
                        buss_days = parseInt(value);
                    }                                       
                }                             
            } 
            // if 'fecha de pago' then get value and obtain year
            if (descrip === 'Fecha de pago' && key === 'value' && typeof value === "string" ) {                
                if (parseInt(value) >= 1000000000000) {
                    holi_year = new Date(parseInt(value)).getFullYear();
                    //console.log(holi_year-1);
                }
            }                       
        }
    )})
    const holiday_obj = new Holidays((holi_year-1).toString(), cons_days, buss_days) 
    return holiday_obj;
}

export function get_requested_holidays(tasks: any) 
{
    let list:Array<RequestHolidays> = [];
    let request_holiday_list;
    let end_day:number = 0;
    let start_day:number = 0;
    let no_labor_days:number = 0;
    let task_url:string ='';
    let holiday_year:string ='';

    // name: "Cuántos días feriados hay en el medio?" - custom field-type config-option 1 .. 4
    // field_id : "677c9bc3-00b0-4eed-a52c-58e8587d08d5"

    // name: "A qué período vacacional corresponde?" - idem ant. 1..8
    // field_id : "b5d61f4c-f023-4b07-8aae-ea2c788f6d4e"

    // name : "Quién?" - array[0], object {id, username, email, ...}
    // field_id : "4d5b2614-3513-47e6-a697-5013093eb4c0"

    tasks.forEach((obj: { [s: string]: unknown; } | ArrayLike<unknown>) => 
    {
        Object.entries(obj).forEach(([key, value]) => 
        { 
            // if key = due_date => end requested holiday        
            if (key === 'due_date' && typeof value === "string" ) 
            {
                end_day = parseInt(value);
            }
            // if key = start_date => start requested holiday        
            if (key === 'start_date' && typeof value === "string" ) 
            {
                start_day = parseInt(value);
            }
            // if key = url => task url in clickUp, to review request holiday...        
            if (key === 'url' && typeof value === "string" ) 
            {
                task_url = value;
            }
            // if key = custom_fields => get dias feriados en medio, and periodo vacacional        
            if (key === 'custom_fields') 
            {
                //console.log(value);
                let resp = get_custom_fields_from_req_holidays(value);
                if (resp) {
                    no_labor_days = get_no_labor_days(resp[0]);
                    holiday_year = get_holiday_period(resp[1]);
                }
            }

        })
        // create request holiday obj and add to the list
        let req_holiday_obj = new RequestHolidays(start_day, end_day, no_labor_days, task_url, holiday_year);
        list.push(req_holiday_obj);
    });    
    return list;
}

// get holiday period from clickUp definition of custom field: "A qué período vacacional corresponde?"
function get_holiday_period(value:number) {
    let holi_year = "";
    switch (value) {
        case 0: holi_year = '2018';
            break;
        case 1: holi_year = '2019';
            break;
        case 2: holi_year = '2020';
            break;
        case 3: holi_year = '2021';
            break;
        case 4: holi_year = '2022';
            break;
        case 5: holi_year = '2023';
            break;
    }
    return holi_year;
}

// get no labor days from clickUp definition of custom field: "Cuántos días feriados hay en el medio?"
function get_no_labor_days(value:number) {
    let no_labor = 0;
    switch (value) {
        case 0: no_labor = 1;
            break;
        case 1: no_labor = 2;
            break;
        case 2: no_labor = 3;
            break;
        case 3: no_labor = 0;
            break;        
    }
    return no_labor;
}

// Requested Holidays - iterate over 'custom fields' array in clickup tasks list
// to retrieve : 'feriados en medio' and 'periodo vacacional'
function get_custom_fields_from_req_holidays(data: any) { 
    let descrip:string = "";   
    let feriados_medio: number=-1;
    let periodo: number=-1;

    data.forEach((custom_obj: { [s: string]: unknown; } | ArrayLike<unknown>) => 
    {
        Object.entries(custom_obj).forEach(([key, value]) => 
        { 
            if (key === 'name' && value === 'Cuántos días feriados hay en el medio?' || 
                value === 'A qué período vacacional corresponde?') {                
                descrip = value;
            }                 
            
            if (key === 'value')
            {                
                if (typeof value === "number") {            
                    if (value >= 0) {
                        if (descrip === 'Cuántos días feriados hay en el medio?') {
                            feriados_medio = value;
                        }
                        if (descrip === 'A qué período vacacional corresponde?') {
                            periodo = value;
                        }                                       
                    }
                }                          
            }
                                   
        }
    )})
    const resp = [feriados_medio, periodo];
    return resp;
}