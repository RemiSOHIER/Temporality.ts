export {}
declare global {
    interface Date{
        /** @remarks Add or subtract a number */
        addYear(year:number):Date
        /** @remarks Add or subtract a number */
        addMonth(month:number):Date
        /** @remarks Add or subtract a number */
        addDay(day:number):Date
        /** @remarks Add or subtract a number */
        addHour(hour:number):Date
        /** @remarks Add or subtract a number */
        addMinute(minute:number):Date
        /** @remarks Add or subtract a number */
        addSecond(second:number):Date
        /** @remarks Retourne True si le jour fait partie du week-end */
        isWeekEnd():boolean
        /** @remarks Retourne le nombre de jours dans le mois */
        daysInMonth():number
        /** @remarks Retourne le nombre de jours dans l'année */
        daysInYear():number
        /** @remarks Retourne l'heure au format local ex: hh:mm:ss */
        getStringTime():string
        /** @remarks retourne la date au format local ex: 11 janvier 2000 */
        getStringDate():string
        /** * @remarks retourne la dénomination du jour */
        getStringDay():string
        /** @remarks Retourne la dénomination du mois */
        getStringMonth():string
        /** @param dateString (DateString) le type de text voulu en résultat */
        getString(dateString:DateString):string
    }
}
Date.prototype.addYear = function(year:number):Date{
    let date:Date = this
    date.setFullYear(this.getFullYear()+year)
    return date
}
Date.prototype.addMonth = function(month:number):Date{
    let date:Date = this
    date.setMonth(this.getMonth()+month)
    return date
}
Date.prototype.addDay = function(day:number):Date{
    let date:Date = this
    date.setDate(this.getDate()+day)
    return date
}
Date.prototype.addHour = function(hour:number):Date{
    let date:Date = this
    date.setHours(this.getHours()+hour)
    return date
}
Date.prototype.addMinute = function(minute:number):Date{
    let date:Date = this
    date.setMinutes(this.getMinutes()+minute)
    return date
}
Date.prototype.addSecond = function(second:number):Date{
    let date:Date = this
    date.setSeconds(this.getSeconds()+second)
    return date
}
Date.prototype.isWeekEnd = function():boolean{
    return this.getDay() === 0 || this.getDay() === 6;
}
Date.prototype.daysInMonth = function():number{
    return (new Date(this.getFullYear(), this.getMonth()+1, 0).getDate() - new Date(this.getFullYear(), this.getMonth(), 1).getDate()+1)
}
Date.prototype.daysInYear = function():number{
    return (new Date(this.getFullYear(), 2, 0).daysInMonth() === 29)?366:365
}
Date.prototype.getStringTime = function():string{
    return this.toLocaleString().split(" ")[1]
}
Date.prototype.getStringDate = function():string{
    let monthStr:string = this.toLocaleString("default", {month: "long"})
    let month:string = monthStr[0].toUpperCase()+monthStr.slice(1)
    let day:string = this.toLocaleString("default", {day: "numeric"})
    return day+" "+month+" "+this.getFullYear()
}
Date.prototype.getStringDay = function():string{
    let dayStr:string = this.toLocaleString("default", {weekday: "long"})
    let day:string = dayStr[0].toUpperCase()+dayStr.slice(1)
    return day
}
Date.prototype.getStringMonth = function():string{
    let monthStr:string = this.toLocaleString("default", {month: "long"})
    let month:string = monthStr[0].toUpperCase()+monthStr.slice(1)
    return month
}
export enum DateString{
    heure = "heure",
    dateNumeric = "dateNumeric",
    dateString = "dateString",
    dateComplete = "dateComplete"
    
}
Date.prototype.getString = function(dateString:DateString):string{
    let str:string = ""
    switch(dateString){
        case DateString.heure:
            str = this.toLocaleString().split(" ")[1]
            break
        case DateString.dateNumeric:
            str = this.toLocaleString().split(" ")[0]
            break
        case DateString.dateString:
            let dayStr:string = this.toLocaleString("default", {weekday: "long"})
            let dayStrWithCapLetter:string = dayStr[0].toUpperCase()+dayStr.slice(1)
            let day:string = this.toLocaleString("default", {day: "numeric"})
            let monthStr:string = this.toLocaleString("default", {month: "long"})
            let month:string = monthStr[0].toUpperCase()+monthStr.slice(1)
            str = dayStrWithCapLetter+" "+day+" "+month+" "+this.getFullYear()
            break
        case DateString.dateComplete:
            str = this.toLocaleString()
            break
    }
    return str
}
//-----------------------------------------------------------------------------------
//------------------------------- OBJECTS PERIODE -----------------------------------
//-----------------------------------------------------------------------------------
export enum TimeType{
    timestamp = "timestamp",
    seconds = "seconds",
    minutes = "minutes",
    heures = "heures",
    jours = "jours",
    semaines = "semaines",
    mois = "mois",
    annee = "annee"
}
export enum PeriodeType{
    horaire = "horaire",
    journalier = "journalier",
    hebdomadaire = "hebdomadaire",
    mensuelle = "mensuelle",
    bimensuelle = "bimensuelle",
    trimestrielle = "trimestrielle",
    semestrielle = "semestrielle",
    annuelle = "annuelle"
}
export class PeriodeData{
    debut:Date = new Date()
    fin:Date = new Date()
    constructor(debut?:Date|string, fin?:Date|string){
        if(debut){this.debut = new Date(debut)}
        if(fin){this.fin = new Date(fin)}
    }
}
export enum Chronologie {
    past = "past",
    actual = "actual",
    futur = "futur"
}
//-----------------------------------------------------------------------------------
//----------------------------------- PERIODE ---------------------------------------
//-----------------------------------------------------------------------------------
export class Periode{
    referenceDate:Date = new Date()
    debut:Date = new Date()
    fin:Date = new Date()
    modifier:number = 0
    private periodeType:PeriodeType = PeriodeType.mensuelle
    constructor(date?:Date|string, modifier?:number){
        this.referenceDate = date?new Date(date):new Date()
        this.modifier = modifier?modifier:0
        this.SetPeriod(this.modifier)
    }
    /**
     * @remarks Calcule et définit une periode par rapport a la date actuelle et un modifier
     * @param modifier integer permet de passer d'une periode a l'autre simplement
     * @param date La date utilisée pour trouver la periode si non défini, se réfère a "new Date()"
     */
    public SetPeriod(modifier?:number, date?:Date):void{
        if(!modifier){modifier = this.modifier}
        let periodeData:PeriodeData = this.GetPeriod(modifier, date)
        this.debut = periodeData.debut
        this.fin = periodeData.fin
    }
    /**
     * @remarks Calcule la periode par rapport a la date actuelle et un modifier
     * @param modifier integer permet de passer d'une periode a l'autre simplement
     * @param date La date utilisée pour trouver la periode si non défini, se réfère a "new Date()"
     */
    public GetPeriod(modifier?:number, date?:Date):PeriodeData{
        if(!modifier){modifier = this.modifier}
        modifier = Math.trunc(modifier)
        if(!date){date = new Date(this.referenceDate)}
        let periodeData:PeriodeData = new PeriodeData()
        let monthStart:number = 0
        let nbMonths:number = 0
        switch(this.periodeType){
            case PeriodeType.mensuelle:
                nbMonths = 1
                break
            case PeriodeType.bimensuelle:
                nbMonths = 2
                break
            case PeriodeType.trimestrielle:
                nbMonths = 3
                break
            case PeriodeType.semestrielle:
                nbMonths = 6
                break
            case PeriodeType.annuelle:
                nbMonths = 12
                break
        }
        //for inner month periods
        if(this.periodeType == PeriodeType.hebdomadaire || this.periodeType == PeriodeType.journalier || this.periodeType == PeriodeType.horaire){
            switch(this.periodeType){
                case PeriodeType.horaire:
                    periodeData.debut.setHours(date.getHours(), (modifier * 60), 0, 0)
                    periodeData.fin.setHours(date.getHours(), 60 + (modifier * 60), 0, 0)
                    break
                case PeriodeType.journalier:
                    periodeData.debut.setDate(date.getDate() + modifier)
                    periodeData.debut.setHours(0, 0, 0, 0)
                    periodeData.fin.setDate(periodeData.debut.getDate())
                    periodeData.fin.setHours(23, 59, 59, 999)
                    break
                case PeriodeType.hebdomadaire:
                    let dayOfWeek:number = (date.getDay() + 6) % 7
                    periodeData.debut.setDate(date.getDate() - dayOfWeek + (modifier * 7))
                    periodeData.debut.setHours(0, 0, 0, 0)
                    periodeData.fin.setDate(periodeData.debut.getDate() + 6);
                    periodeData.fin.setHours(23, 59, 59, 999)
                    break
            }
        }else{//for outer month periods
            if(nbMonths > 1){
                monthStart = Math.floor(date.getMonth() / nbMonths) * nbMonths + modifier * nbMonths
                periodeData.debut.setMonth(monthStart)
                periodeData.fin.setMonth(periodeData.debut.getMonth() + nbMonths)
            }else{
                periodeData.debut.setMonth(periodeData.debut.getMonth() + modifier)
                periodeData.fin.setMonth(periodeData.debut.getMonth() + 1 + nbMonths)
            }
            periodeData.debut.setDate(1)
            periodeData.debut.setHours(0, 0, 0, 0)
            periodeData.fin.setDate(0)
            periodeData.fin.setHours(23, 59, 59, 999)
        }
        return periodeData
    }
    /**
     * @remarks Défini le type de periode souhaité et met a jour la periode en conséquence
     */
    public SetPeriodeType(periodeType:PeriodeType):void{
        this.periodeType = periodeType
        this.SetPeriod(this.modifier)
    }
    /**
     * @remarks Retourne le type de période utilisé
     */
    public GetPeriodeType():PeriodeType{return this.periodeType}
    /**
     * @remarks Retourne la periode au format texte (string)
     */
    public ToString(dateString?:DateString):string{
        if(!dateString){dateString = DateString.dateNumeric}
        return this.debut.getString(dateString)+" - "+this.fin.getString(dateString)
    }
    /**
     * @remarks Calcule si une periode est passée, présente ou a venir
     * @param date La date a comparer avec la période, pour savoir si la date en dans la période ou en dehors, si non défini, se réfère a "new Date()"
     * @param periode la periode dans laquelle on vérifie si se trouve la date, si non défini, se réfère a l'objet Periode
     */
    public PeriodeIs(date?:Date|string, periode?:PeriodeData):Chronologie{
        if(!date){
            date = new Date()
        }else{
            date = new Date(date)
        }
        if(!periode){
            periode = new PeriodeData()
            periode.debut = this.debut
            periode.fin = this.fin
        }
        let debutDiff = this.Difference(TimeType.seconds, date, new Date(periode.debut))
        let finDiff = this.Difference(TimeType.mois, date, new Date(periode.fin))
        let chronologie:Chronologie = Chronologie.actual
        if (debutDiff < 0 && finDiff > 0) {
            chronologie = Chronologie.actual
        } else {
            if(finDiff < 0){
                chronologie = Chronologie.past
            }
            if(debutDiff > 0){
                chronologie = Chronologie.futur
            }
        }
        return chronologie
    }
    /**
     * @remarks Retourne la différence de temps
     * @param toTime Utiliser un object TimeType pour avoir la différence en heure, en jour ou autre
     * @param debut la date de début pour le calcul, si non définie, se réfère a l'objet periode
     * @param fin la date de fin pour le calcul, si non définie, se réfère a l'objet periode
     */
    public Difference(toTime?:TimeType, debut?:Date|string, fin?:Date|string){
        if(!toTime){toTime = TimeType.jours}
        debut = new Date(debut?debut:this.debut)
        fin = new Date(fin?fin:this.fin)
        let diff:number = fin.getTime() - debut.getTime()
        return this.Convert(toTime, diff)
    }
    public Convert(toTime:TimeType, time:number, precision?:number):number{
        //arrondit au nombre supérieur, peut poser des problèmes
        if(!precision){precision = 0}
        let calc:number = 0
        switch(toTime){
            case TimeType.timestamp:
                calc = time
                break
            case TimeType.seconds:
                calc = time/1000
                break
            case TimeType.minutes:
                calc = time/1000/60
                break
            case TimeType.heures:
                calc = time/1000/60/60
                break
            case TimeType.jours:
                calc = time/1000/60/60/24
                break
            case TimeType.semaines:
                calc = time/1000/60/60/24/7
                break
            case TimeType.mois:
                calc = time/1000/60/60/24/30
                break
            case TimeType.annee:
                calc = time/1000/60/60/24/365
                break
        }
        if(calc < 1){
            time = this.floatFormat(calc, precision)
        }else{
            time = Math.ceil(calc)
        }
        return time
    }
    private floatFormat(nbr:number, afterPoint?:number):number{
        if(!afterPoint){afterPoint = 2}
        return Number(Number.parseFloat(nbr.toString()).toFixed(afterPoint))
    }
}
/*----------------------------GLOBAL PERIODE---------------------------------*/
//Define interface PeriodeClass globale
interface PeriodeConstructor{
    new (date?:Date|string):Periode
    (date?:Date|string):Periode
}
//Implements function Periode as constructor
const PeriodeFunction = function(date?:Date|string):Periode{
    return new Periode(date)
} as PeriodeConstructor
//Associer la classe a la fonction pour usage de 'new'
PeriodeFunction.prototype = Periode.prototype
//Associer la classe a la fonction
Object.setPrototypeOf(PeriodeFunction, Periode)

//declare global Periode class/function
declare global{
    var Periode:PeriodeConstructor
}
/*----------------------------GLOBAL PERIODE---------------------------------*/
