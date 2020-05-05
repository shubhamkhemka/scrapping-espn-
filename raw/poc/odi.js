const request =require("request");
const fs=require("fs");
const cheerio=require("cheerio");
let leaderBoard=[];
let gcount=0;
// console.log("before");

request("https://www.espncricinfo.com/scores/series/19322",function(err,res,html){
    if(err==null&&res.statusCode==200){
        fs.writeFileSync("index.html",html);
        parsehtml(html);
    }
    else if(res.statusCode===404){
        console.log("page not fount");
    }
    else{
        console.log(err);
        // console.log(res);
    }
})
// console.log("after");
function goTomatch(x){
    gcount++;
    request(x,function(err,res,html){

     if(err==null&&res.statusCode==200){
         handlematch(html);
         gcount--;

         if(gcount==0){
         console.table(leaderBoard);
         }
    }
    else if(res.statusCode===404){
        console.log("page not fount");
    }
    else{
        console.log(err);
        // console.log(res);
    }
})
}

function handlematch(html){
    const d=cheerio.load(html);
    let format =d(".cscore.cscore--final.cricket .cscore_info-overview").html();
    format=format.includes("ODI")?"ODI":"T20I";
    let teams =d(".sub-module.scorecard h2");
    let innings =d(".sub-module.scorecard");
    // console.log(format); 
   
   for(let i=0;i<innings.length;i++){
       let batsman =d(innings[i]).find(".scorecard-section.batsmen .flex-row .wrap.batsmen");
    //    console.log(d(teams[i]).text());
       for(let j=0;j<batsman.length;j++){
           let bat=d(batsman[j]);
           let name=bat.find(".cell.batsmen").text();
           let runs=bat.find(".cell.runs").html();
           let team1=d(teams[i]).text();
        //    team1=team1.includes("india")? "India":"New Zealand";
           handleplayer(format,team1,name,runs);

        //    console.log(name+"\t\t"+runs);
       }
    //    console.log("***********************");      
   }
//    console.log("...............................................................................................................");


}
function handleplayer(format,team,name,runs){
    batrun=Number(runs);
    for(let i=0;i<leaderBoard.length;i++){
        let obj=leaderBoard[i];
        if(obj.Name==name&&obj.Format==format){
            obj.Runs+=parseInt(runs);
            return;
        }
    }
    let obj={
        Runs:runs,
        Format:format,
        Team:team,
        Name:name
    }
    leaderBoard.push(obj);
}




function parsehtml(html){

    console.log(".......................................................................");
   
    let d=cheerio.load(html);
    // count=0;

    let score=d(".cscore.cscore--final.cricket.cscore--watchNotes");
    // console.log(score.text());
    for(let i=0;i<score.length;i++){
        let type=d(score[i]).find(".cscore_info-overview").text();
        let test=type.includes("ODI")||type.includes("T20I");
        if(test){
            let x=d(score[i]).find(".cscore_buttonGroup ul li a").attr("href");
            let link=`https://www.espncricinfo.com${x}`;
            goTomatch(link);
            // count++;
        }
    }
     
}