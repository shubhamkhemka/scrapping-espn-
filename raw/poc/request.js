const request =require("request");
const fs=require("fs");
const cheerio=require("cheerio");

console.log("before");

request("https://www.espncricinfo.com/series/19322/scorecard/1187683",function(err,res,html){
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
console.log("after");

function parsehtml(html){
    // console.log("last ball commentary");
    console.log(".......................................................................");
   
    let d=cheerio.load(html);
    // let itemwrapper=$(".item-wrapper .description");
    let score=d(".scorecard-section.bowling table tbody tr");
    // fs.writeFileSync("bowling.html",score);
    let maxw=0;
        let mname="";
    for(let i=0;i<score.length;i++){
        
       let name=d(d(score[i]).find("td")[0]).text();        
       let wickets=d(d(score[i]).find("td")[5]).text();   
       if(maxw<wickets){
           maxw=wickets;
           mname=name;
       }
    //  console.log(mname +"\t\t"+maxw);
 
//   console.log("last ball commentary");
      
}
console.log(mname +"\t\t"+maxw);
    // let head=$(itemwrapper[0]).text();
    // let text=head.text();
    // console.log(head);
     
}