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

// iterate over 'custom fields' array in clickup tasks list
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
