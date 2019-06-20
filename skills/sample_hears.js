var request = require('request');
var uselist = [];
var botUseList = [];
usersList();
botUsersList()
module.exports = function(controller, dialogflowMiddleware) {
   var privateMessage;
   var dateCompResult;
   var dateValidResult;
   var am = 0;
   var un = 0;
   var category = undefined;
   var category2 = undefined;
   var privCategory;
    controller.hears(['Default Welcome Intent, Date Intent, duration, Date Number'], 'direct_message, ambient' , dialogflowMiddleware.hears, function(
    bot,
    message
  ) 
  
  {
    if(message.event !== undefined)
    {
        if(message.event.channel === 'CJEJMN9PF' || searchUser(message))
        {
            replyText = message.fulfillment.text;     // message object has new fields added by Dialogflow
            console.log(message);                     //Prints the details about the message
            var userId;                               //Declaration of variables
            var textMessage;
            var count = 0;
            var flag2 = 0;
            var flag1 = 0; 
            var flag3 = 1;
            var sd = "undefined"; 
            var ed = "undefined";
            var add = 0;
            var message1;
            var message2;
            var d1 = d2 = d3 = d4 = dpd1 = dpd2 = dpd3 = dpd4 = "undefined";
            if(message.event.text.includes("tomorrow"))    //for parameter add
            {
               add = "tomorrow";
            }
           if(message.event.text.includes("yesterday"))   //for parameter add
            {
               add = "yesterday";
            }
            
            console.log("PARAMETERS:");                   //Prints the parameters in the message
            var para = message.nlpResponse.queryResult.parameters;
            console.log(para);
            
            //if a message contains two availability entities
            if(para.fields.Availability && para.fields.Availability2)
            {  
               if(para.fields.Availability.stringValue != '' && para.fields.Availability2.stringValue != '')
              {
                var returnMsg = twoAvail(message, para);
                message1 = returnMsg[0];
                message2 = returnMsg[1];
                category = returnMsg[2];
                category2 = returnMsg[3];
              }
            }
         
            //when message contains dates wihtout any month; Eg- 21, 22, 23 June
            if(para.fields['number-integer'])
            {
              var returnMsg = dateReply(message, para);
              privateMessage = returnMsg[0];
              privCategory = returnMsg[1];
            }
           
            //if a message does not specify dates but specifies the duration; Eg- wfh for 2 days
            else if(!para.fields.date1 && !para.fields.date2)
            { 
              flag3 = 0;
              var returnMsg = onlyDuration(message, para);
              privateMessage = returnMsg[0];
              privCategory = returnMsg[1];

              if(para.fields.duration)
              {
                  am = para.fields.duration.structValue.fields.amount.numberValue;
                  un= para.fields.duration.structValue.fields.unit.stringValue;
              }      
            }

            //when message specifies dates but no duration
            else
            {
              var startDate = para.fields.date1.stringValue;  //Extracts values from different date parameters
              var endDate = para.fields.date2.stringValue;
              var dateThree = para.fields.date3.stringValue;
              var dateFour = para.fields.date4.stringValue;
              var d = new Date();
              var h = d.getHours();                          //gives the current time
              var m = d.getMinutes(); 
              var s = d.getSeconds()
              var day = String(d.getDate());                 //gives the current day
              var month = String((d.getMonth() + 1));
              var year = d.getFullYear();
              var currentDate = month + '-' + day + "-" + year;
              var currentTime = h + ':' + m + ':' + s;

              //finds out dates if date-period is present
              if((para.fields['date-period'] && para.fields['date-period'].structValue !== undefined) ||(para.fields['date-period2'] && para.fields['date-period2'].structValue !== undefined))// && startDate == " ")
              {
                if(para.fields['date-period'] && para.fields['date-period'].structValue !== undefined)
                {
                  var datePeriodSd = para.fields['date-period'].structValue.fields.startDate.stringValue;
                  var datePeriodEd = para.fields['date-period'].structValue.fields.endDate.stringValue;
                  var datePeriodSdOnly = datePeriodSd.split('T');
                  var datePeriodEdOnly = datePeriodEd.split('T');
                }
                
                if(para.fields['date-period2'] && para.fields['date-period2'].structValue !== undefined)
                {
                  var datePeriodDate3 = para.fields['date-period2'].structValue.fields.startDate.stringValue;
                  var datePeriodDate4 = para.fields['date-period2'].structValue.fields.endDate.stringValue;
                  var datePeriodDate3Only = datePeriodDate3.split('T');
                  var datePeriodDate4Only = datePeriodDate4.split('T');
                }
               
                const a = new Date(datePeriodSdOnly);
                const b = new Date(datePeriodEdOnly);
                
                dateCompResult = dateCompare(a, b);
                dateValidResult = dateValidation(am, un, a, b);
                if(dateValidResult == true)
                {
                  am = 0;
                  un = 0; 
                }
                
                if(para.fields['date-period'] && para.fields['date-period'].structValue !== undefined)
                {
                  if(datePeriodSdOnly[0] !== "")
                  {
                    dpd1 = sd = datePeriodSdOnly[0].concat(' ' + currentTime);
                  }
                  else
                  {
                    dpd1 = sd = "undefined";
                  }
                 
                  if(datePeriodEdOnly[0] !== "")
                  {
                    dpd2 = ed = datePeriodEdOnly[0].concat(' ' +currentTime);
                  }
                  else
                  {
                     dpd2 = ed = "undefined";
                  }
                }

                if(para.fields['date-period2'] && para.fields['date-period2'].structValue !== undefined)
                {
                  
                  if(datePeriodDate3Only[0] !== "")
                  {
                      dpd3 = sd = datePeriodDate3Only[0].concat(' ' + currentTime);
                  }
                  else
                  {
                     dpd3 = sd = "undefined";
                  }
                 
                  if(datePeriodDate4Only[0] !== "")
                  {
                     dpd4 = ed = datePeriodDate4Only[0].concat(' ' +currentTime);
                  }
                  else
                  {
                      dpd4 = ed = "undefined";
                  }
                }
              }

            //finds out dates when date1 and date2 are present
            if((para.fields.date1 && para.fields.date1.stringValue !== '') || (para.fields.date2 && para.fields.date2.stringValue !== ''))
            {
                var startDateOnly = startDate.split('T');
                var endDateOnly = endDate.split('T');
                var dateThreeOnly = dateThree.split('T');
                var dateFourOnly = dateFour.split('T');
                const a = new Date(startDateOnly);
                const b = new Date(endDateOnly);
                
                dateCompResult = dateCompare(a, b);
                dateValidResult = dateValidation(am, un, a, b);
                if(dateValidResult == true)
                {
                  am = 0;
                  un = 0; 
                }
                
                if(startDateOnly[0] !== "")
                {
                  d1 = sd = startDateOnly[0].concat(' ' + currentTime);
                }
                else
                {
                  d1 = sd = "undefined";
                }
               
                if(endDateOnly[0] !== "")
                {
                  d2 = ed = endDateOnly[0].concat(' ' +currentTime);
                }
                else
                {
                  d2 = ed = "undefined";
                }

                if(dateThreeOnly[0] !== "")
                {
                  d3 = dateThreeOnly[0].concat(' ' +currentTime);
                }
                else
                {
                  d3 = "undefined";
                }

                if(dateFourOnly[0] !== "")
                {
                  d4 = (dateFourOnly[0].concat(' ' +currentTime));
                }
                else
                {
                  d4 = "undefined";
                }

                if(!para.fields.date2 || endDate == '')
                {
                  ed = sd;
                }
              }
            }
            //figures out dates when one message contains 2 Availability messages
            if((para.fields.Availability && para.fields.Availability.stringValue != '') && (para.fields.Availability2 && para.fields.Availability2.stringValue != ''))
            {
                returnMsg = twoAvailDates(d1, d2, d3, d4, dpd1, dpd2, dpd3, dpd4);
                sd1 = returnMsg[0];
                ed1 = returnMsg[1];
                sd2 = returnMsg[2];
                ed2 = returnMsg[3];
            }

            if(dateCompResult== undefined && dateValidResult === undefined)
            {
              dateCompResult = true;
              dateValidResult = true;
            }
            
            //Inserts the message into the google sheet and replies on the channel
            if(flag3 !== 0 && dateCompResult === true && dateValidResult === true && para.fields && ((para.fields.Availability && para.fields.Availability.stringValue != '') || (para.fields.date1 && para.fields.date1.stringValue != '')))
            {
             //stores message in textMessage
             if((para.fields.Availability.stringValue === '' || !para.fields.Availability) && (!para.fields.Availability2 || para.fields.Availability2.stringValue === ''))
             {
               textMessage = privateMessage;
               category = privCategory;
             }
             else
             {
               textMessage = message.event.text;
               if(para.fields.Availability.stringValue !== '')
               {
                category = para.fields.Availability.stringValue;
               }
               else if(para.fields.Availability2.stringValue !== '')
               {
                 category = para.fields.Availability2.stringValue;
               }
              }
             //retrieves ID if name mentioned directly - @NAME
             if(textMessage.includes('<@'))     
             {
              if(textMessage.includes("rest of this week") || textMessage.includes("rest of the week") || textMessage.includes("rest of week") || textMessage.includes("end of the week") || textMessage.includes("end of this week") || textMessage.includes("end of week"))
              { 
                var dNow = new Date();
                var dateNew = lastDayOfWeek(dNow);
                if(sd == "undefined")
                {
                  sd = currentDate + " " + currentTime;    //Stores starting date which here is today;s date when message includes the above words/sentence
                }
                ed = dateNew + " " + currentTime;          //Stores ending date which here is last day of the week
              }

               if(textMessage.includes("end of the month") || textMessage.includes("end of this month") || textMessage.includes("end of month") || textMessage.includes("rest of month") || textMessage.includes("rest of the month") || textMessage.includes("rest of this month"))
               {
                  var dateNew = lastDayOfMonth(year, month);
                  if(sd == "undefined")
                  {
                    sd = currentDate + " " + currentTime;   //Stores starting date which here is today;s date when message includes the above words/sentence
                  }
                    ed = dateNew + " " + currentTime;       //Stores ending date which here is last day of the month
                }

               var splitMessage = textMessage.split(" ");
               for(let x of splitMessage)
               {
                 if(x.includes('@'))
                 {
                   var word = x;
                   userId = word.substr(2,9);
                   for(let y of uselist)
                  {
                    if(userId === y.id)
                    {
                     var userName =  y.profile.real_name;  
                     
                     if(para.fields.Availability.stringValue != '' && para.fields.Availability2.stringValue != '')
                     {  
                        message1 = message1.replace(x, userName);  //replaces direct mention by Name                              //when two availability entities
                        insertIt(userName, message1, category, sd1, ed1, add);
                        insertIt(userName, message2, category2, sd2, ed2, add);
                        bot.reply(message, replyText);
                     }
                     else
                     {
                        textMessage = textMessage.replace(x, userName);  //replaces direct mention by Name 
                        bot.reply(message, replyText);
                        insertIt(userName, textMessage, category, sd, ed, add);
                     }
                    }
                   }
                  }
                }
              }
         
            //for indirect or no mentions
            else
            {
              userId = message.event.user;
              for(let y of uselist)
              {
                //stores message in textMessage
                if((para.fields.Availability.stringValue === '' || !para.fields.Availability) && (para.fields.Availability2.stringValue === '' || !para.fields.Availability2 ))
                {
                  textMessage = privateMessage;
                  category = privCategory;
                }
                else
                {
                  textMessage = message.event.text;
                  if(para.fields.Availability.stringValue !== '')
                  {
                     category = para.fields.Availability.stringValue;
                  }
                  else if(para.fields.Availability2.stringValue !== '')
                  {
                      category = para.fields.Availability2.stringValue;
                  }
               
                }
                
                if(y.real_name !== undefined )
                {
                  if(textMessage.toLowerCase().includes(y.real_name.toLowerCase()))    //when full name is mentioned in the name
                  {
                    var rname2 = y.real_name;
                    flag1 = 1;
                    flag2 = 0;
                    break;
                  }
              
                  else if( y.profile.first_name !== undefined)
                  {
                    if(textMessage.toLowerCase().includes(y.profile.first_name.toLowerCase()))   //when only first name is mentioned in the message
                    {
                      var rname = y.real_name;
                      count++;
                      flag2 = 1;
                    }
                  }
                }
              }
             
             if(textMessage.includes("rest of this week") || textMessage.includes("rest of the week") || textMessage.includes("rest of week") || textMessage.includes("end of the week") || textMessage.includes("end of this week") || textMessage.includes("end of week"))
             { 
               var dNow = new Date();
               var dateNew = lastDayOfWeek(dNow);
               if(sd == "undefined")
               {
                 sd = currentDate + " " + currentTime;
               }
               ed = dateNew + " " + currentTime;
             }
              
             if(textMessage.toLowerCase().includes("end of the month") || textMessage.toLowerCase().includes("end of this month") || textMessage.toLowerCase().includes("end of month"))
             {
                var dateNew = lastDayOfMonth(year, month);
                if(sd == "undefined")
                  {
                    sd = currentDate + " " + currentTime;
                  }
                 ed = dateNew + " " + currentTime;
              }
             
              if(count > 1)                        //gives error name clashes
              {
                bot.reply(message, 'Name clash! Cannot record! Enter the entire message again with correct surname!');
              }
             else if(flag2 === 1 && count <= 1)   //when full name mentioned
             {
                if(para.fields.Availability.stringValue != '' && para.fields.Availability2.stringValue != '')
                {                                                    //when two availability entities
                  insertIt(rname, message1, category, sd1, ed1, add);
                  insertIt(rname, message2, category2, sd2, ed2, add);
                  bot.reply(message, replyText);
                }
                else
                {                                                    //when only one availability entity
                  insertIt(rname, textMessage, category, sd, ed, add); 
                  bot.reply(message, replyText);
                }
             }
             else if(flag1 === 1)                                    //when only first name is mentioned
             {
                if((para.fields.Availability != '' && para.fields.Availability.stringValue != '') && (para.fields.Availability2 != '' && para.fields.Availability2.stringValue != ''))
                {                                                    //when two availability entities
                  insertIt(rname2, message1, category, sd1, ed1, add);
                  insertIt(rname2, message2, category2, sd2, ed2, add);
                  bot.reply(message, replyText);
                }
                else
                {                                                    //when only one availability entity
                  insertIt(rname2, textMessage, category, sd, ed, add); 
                  bot.reply(message, replyText);
                }
              }
             
             if(flag1 === 0 &&  flag2 === 0)                         //when no name mentioned in the message
             {
              for(let x of uselist)
               {
                if(x.id !== undefined)
                 {
                  if(x.id === userId)
                   { //stores message in textMessage
                    if((para.fields.Availability.stringValue === '' || !para.fields.Availability) && (para.fields.Availability2.stringValue === '' || !para.fields.Availability2 ))
                    {
                      textMessage = privateMessage;
                      category = privCategory;
                    }
                    else
                    {
                      textMessage = message.event.text;
                      if(para.fields.Availability.stringValue !== '')
                      {
                         category = para.fields.Availability.stringValue;
                      }
                      else if(para.fields.Availability2.stringValue !== '')
                      {
                         category = para.fields.Availability2.stringValue;
                      }
                      else if((para.fields.Availability2.stringValue !== '' && para.fields.Availability2.stringValue !== ''))
                      {
                        category = para.fields.Availability.stringValue;
                        category2 = para.fields.Availability2.stringValue;
                        
                      }
                   }
                  
                    if(textMessage.includes("rest of this week") || textMessage.includes("rest of the week") || textMessage.includes("rest of week") || textMessage.includes("end of the week") || textMessage.includes("end of this week") || textMessage.includes("end of week"))
                    { 
                      var dNow = new Date();
                      var dateNew = lastDayOfWeek(dNow);
                      if(!para.fields.date1 || para.fields.date1.stringValue == false)
                      {
                        sd = currentDate + " " + currentTime;
                      }
                      ed = dateNew + " " + currentTime;
                    }

                    if(textMessage.includes("end of the month") || textMessage.includes("end of this month") || textMessage.includes("end of month") || textMessage.includes("rest of month") || textMessage.includes("rest of the month") || textMessage.includes("rest of this month"))
                    {
                      var dateNew = lastDayOfMonth(year, month);
                      if(!para.fields.date1 || para.fields.date1.stringValue == false)
                      {
                        sd = currentDate + " " + currentTime;
                      }
                      ed = dateNew + " " + currentTime;
                    }
                   
                      if((para.fields.Availability && para.fields.Availability2) && (para.fields.Availability.stringValue != '' && para.fields.Availability2.stringValue != ''))
                      {
                        bot.reply(message, replyText);                        //when two availability entities
                        insertIt(x.real_name, message1, category, sd1, ed1, add);
                        insertIt(x.real_name, message2, category2, sd2, ed2, add);
                      }
        
                      else
                     {
                       insertIt(x.real_name, textMessage, category, sd, ed, add);     //when only one availability entity
                       bot.reply(message, replyText);
                     }
                   }
                 }
               }
             }
            }  
           }
           if(dateCompResult === false)                     //gives error if start date comes after end date
           {
              bot.reply(message, "Please enter the entire message again with correct Dates!");
           }

           if(dateValidResult === false)                    //gives error if duaration between the two dates is wrong
           {
               bot.reply(message, "Please enter the correct Dates!");
           }
         }
      }
  });
};

function usersList()                                    //function to store data about the members in the workspace
 {
      request.get('https://slack.com/api/users.list?token='+process.env.AppToken+'&pretty=1', function(err, req, res){
      var userdata = JSON.parse(res);
      uselist = userdata.members;
    }); 
 }

 function insertIt(id, message, category, sd, ed, add)   //function to inserts the datainto the google script
 { 
      if(message.includes('&amp;'))
      {
         message = message.replace(/&amp;/g, '%26');
      }
      request.post(process.env.GoogleScriptUrl+"?&Name="+id+"&Message="+message+"&Category="+category+"&Start Date="+sd+"&End Date="+ed+"&add="+add+"&action=insert", function( error, reque, respo)  
      {
         if(error)
          console.log(error);
         
          console.log("IN INSERT" +sd + "  "+ed);
      });
 }

 function botUsersList()
 {
       request.get("https://slack.com/api/im.list?token="+process.env.AppToken+"&pretty=1", function(err, req, res)
       {
          var userdata = JSON.parse(res);
          botUseList = userdata.ims;
       });
 }

function searchUser(message)
 {
   for(let y of botUseList)
   {
     if(y.id === message.event.channel)
     {
       return true;
       break;   
      }
   }
 }

 function dateCompare(date1, date2)                   //function to check whether or not starting date comes before the ending date 
 {
    msDays = 1000 * 60 * 60 * 24;
    var utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    var utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    var diff = Math.floor((utc2 - utc1) / msDays);
    if(diff < 0)
    {
      return false;
    }
    else 
    {
      return true;
    }
 }

 function dateValidation(a, u, date1, date2)          //function to confirm that the no of days between the given dates is same as the number of days mentionrd for the leave
 {
   var n;
   var wn = mn = dn = 1;
   var wnd = mnd = dnd = 0;
   msDays = 1000 * 60 * 60 * 24;
   var utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
   var utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
   var diff = Math.floor((utc2 - utc1) / msDays);
   if(u == "wk")
   {
     n = 7;
     for(let i = 1; i < a; i++)
     {
        wn++;
     }
     wnd = n * wn;
     if(diff != wnd - 1)
     {
       return false;
     }
     else
     {
       return true;
     }
   }
   
    else if(u == "mo")
   {
     n = 30;
     for(let i = 1; i < a; i++)
     {
        mn++;
     }
     mnd = n * mn;
     if(diff != mnd - 1)
     {
       return false;
     }
     else
     {
       return true;
     }
   }

   else if(u == "day")
   {
     n = 1;
     for(let i = 1; i < a; i++)
     {
        dn++;
     }
     dnd = n * dn;
     if(diff != dnd - 1)
     {
       return false;
     }
     else
     {
       return true;
     }
   }
  
   else if(a == 0 && u == 0)
   {
     return true;
   }
 }

 function lastDayOfMonth(y, m)                    //function to find out the last day of the month
 {
    var lastDay = new Date(y, m, 0).getDate();   
    var d = new Date();      
    var month = String((d.getMonth() + 1));
    var year = d.getFullYear();
    var newDate = month + "-" + lastDay + "-" + year;
    return newDate; 
 }

 function lastDayOfWeek(date)                    //function to find out the last day of the week
{
  var lastday = date.getDate() - (date.getDay() - 1) + 6;
  var d = new Date();      
  var month = String((d.getMonth() + 1));
  var year = d.getFullYear();
  var newDate = month + "-" + lastday + "-" + year;
  return newDate; 
}

function dateReply(message,para)               //function for when dates are mentioned as numbers; Eg- 21, 22, 23 June
{ 
  var privCategory;
  var privateMessage;
  var privateId;
  flag3 = 1;
  privateMessage = message.event.text;
  privateId = message.event.user;
 // privateReply = message.fulfillment.text;
  if(para.fields.Availability.stringValue !== '')
    {
      privCategory = para.fields.Availability.stringValue;
    }
    if(message.event.channel !== searchUser(message))
    {
      bot.reply(message, "<@"+privateId+"> kindly check your DM!");
    }
      bot.startPrivateConversation({
      user: message.event.user
      } ,function(err, convo){
          if(!err && convo)
          {
            convo.say("Please enter the starting and the ending dates of your unavailability in proper date format - dd montName!");
          }
        });

        retArray = [privateMessage, privCategory];
        return retArray;
}

function twoAvail(message, para)              //function that gives the messages when two availability intents are present
{
  var availabilityWord;
  var category;
  var category2;
  var message1;
  var message2;

  var availMessage = message.event.text;
  availabilityWord = para.fields.Availability2.stringValue;
  category = para.fields.Availability.stringValue;
  category2 = para.fields.Availability2.stringValue;
  var index = availMessage.toLowerCase().indexOf(availabilityWord);
  var length = availMessage.length;
  message1 = availMessage.substr(0, index);
  message2 = availMessage.substr(index, length); 
 
  retArray2 = [message1, message2, category, category2];
  return retArray2;
}

function onlyDuration(message, para)                    //fucntion for when only duration is present and no dates; Eg- wfh for 2 days 
{
  flag3 = 0;
  var userName;
  var privCategory;
  var privateMessage;
  var privateId;
  privateMessage = message.event.text;
  privateId = message.event.user;
  if(para.fields.Availability !== undefined)
  {
    if(para.fields.Availability.stringValue !== '')
    {
        privCategory = para.fields.Availability.stringValue;
    }
    if(message.event.channel !== searchUser(message))
    {
      bot.reply(message, "<@" + privateId +"> Okay! Check your DM please!");
    }
    bot.startPrivateConversation({
      user: message.event.user
    } ,function(err, convo){
      if(!err && convo)
      {
        convo.say("Please enter the starting and the ending dates of your unavailability!");
      }
   
    });
  }
  retArray3 = [privateMessage, privCategory];
  return retArray3; 
}

function twoAvailDates(d1, d2, d3, d4, dpd1, dpd2, dpd3, dpd4)   //function that gives the dates when two availability intents are present
{
  var sd1, ed1, sd2, ed2
  if(dpd1 !== "undefined" || dpd3 != undefined)
  {
   if(dpd1 !== "undefined" && dpd3 !== "undefined")
   {
    sd1 = dpd1;
    ed1 = dpd2;
    sd2 = dpd3;
    ed2 = dpd4;
   }

  else if(dpd1 !== "undefined" && dpd3 === "undefined")
  {
    if(d2 !== "undefined" && d4 !== "undefined")
    {
      sd1 = dpd1;
      ed1 = dpd2;
      sd2 = d4;
      ed2 = d2;
    }
    
    else if(d2 !== "undefined" && d4 === "undefined")
    {
      sd1 = dpd1;
      ed1 = dpd2;
      sd2 = d2;
      ed2 = d2;
    }
  }
  
  else if(dpd1 === "undefined" && dpd3 !== "undefined")
  {
    if(d1 !== "undefined" && d3 !== "undefined")
    {
      sd1 = d1;
      ed1 = d3;
      sd2 = dpd3;
      ed2 = dpd4;
    }
    
    else if(d1 !== "undefined" && d3 === "undefined")
    {
      sd1 = d1;
      ed1 = d1;
      sd2 = dpd3;
      ed2 = dpd4;
    }
  }

  else
  {
    if(d3 !== "undefined" && d4 !== "undefined")
    {
    sd1 = d1;
    ed1 = d3;
    sd2 = d4;
    ed2 = d2;
   }
  
  else if(d3 !== "undefined" && d4 === "undefined")
  {
    sd1 = d1;
    ed1 = d3;
    sd2 = d2;
    ed2 = d2;
  }
  
  else if(d3 === "undefined" && d4 !== "undefined")
  {
    sd1 = d1;
    ed1 = d1;
    sd2 = d4;
    ed2 = d2;
  }
  
  else 
  {
    sd1 = d1;
    ed1 = d1;
    sd2 = d2;
    ed2 = d2;
  }
 }
}
retArray = [sd1, ed1, sd2, ed2];
return retArray;
}