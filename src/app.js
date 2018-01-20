window.onload = function(){
    const hourDiv = document.querySelector("#hour").parentElement;
    const minuteDiv =document.querySelector("#minutes").parentElement;
    const secondDiv = document.querySelector("#seconds").parentElement;
    const hour =document.querySelector("#hour");
    const minute = document.querySelector("#minutes");
    const second = document.querySelector("#seconds");
    const progressCircle =document.querySelector(".progress-circle");
    const breakbutton = document.querySelectorAll(".break-button");
    let audio = new Audio('src/alarm.mp3');

    buttonAddEventListener();
    let isPaused = false;
    let canstart=true;
    let breakstart = true;
    let workTimerFinish = false;
    let breakTimerFinish = false;
    let previousPercentText="p0"; // contains the previous percent text of progressCircle
    let breakValueEntered = false;
    let userminText = document.querySelector(".user-min-text");
    let timerInterval;

    for(var i=0;i<breakbutton.length;i++){
        breakbutton[i].addEventListener("click",function(){
            for(var i=0;i<breakbutton.length;i++){
                breakbutton[i].classList.remove("active");
            }
            this.classList.add("active");
        })
    }
    document.querySelector(".pause-resume").addEventListener('click',function(){
        pauseResume();
    })
    document.querySelector(".fa-plus").addEventListener("click",function(e){
        document.querySelector("#break-time-input").style.display="block";
        e.stopPropagation();
        this.style.display="none";
    })
    document.querySelector("#break-time-input").addEventListener("click",function(e){
        e.stopPropagation();
    })

    document.querySelector("#break-time-input").addEventListener("keypress",function(e){
        if(e.keyCode==13){
            if(e.target.value ==""){
                document.querySelector(".fa-plus").style.display="block";
                e.target.style.display="none";
            }else{
                if(eval(e.target.value)){
                    e.target.style.display="none";
                    showUserInputBreakTime(eval(e.target.value));
                }
            }
        }
    })
    function showUserInputBreakTime(value){
        document.querySelector("#user-break-text").textContent =eval(value);
        userminText.style.display="block";
    }
    document.querySelector("#user-break-text").addEventListener("click",function(e){
        document.querySelector(".fa-plus").style.display="block";
        document.querySelector(".user-min-text").style.display="none";
        e.target.textContent="";
    })
    document.querySelector('body').onclick = function(e) {
        //if the plus button is clicked and then if the user clicks outisde input gets disappear
        if(document.querySelector("#break-time-input").style.display=="block"){
            if(!breakValueEntered){
                document.querySelector(".fa-plus").style.display="block";
            }
            document.querySelector("#break-time-input").style.display="none";
        }
    }
    document.querySelector(".reset").addEventListener('click',function(){
        ResetTimer();
    })
    document.getElementById("start").addEventListener("click",function(){
        //start button goes here
        console.log(minute);
        let workduration = eval(hour.innerHTML)*60*60+eval(minute.innerHTML)*60+eval(second.innerHTML);
        let breakduration =document.querySelector(".active").innerText;
        breakduration = eval(breakduration.match(/[0-9]+/)[0])*60;
        // breakduration=eval(b);

        startTimer(workduration,breakduration,document.querySelector("#clock-time"))

    })
    function startTimer(workduration,breakduration, display) {
        //countdown timer function
        document.getElementById("start").style.display="none";
        document.getElementById("clock-time").style.display="block";
        document.querySelector(".countdown").style.display="none";
        document.querySelector(".time-remaining").style.display="block";
        document.querySelector(".button-container").style.display="flex";
        document.querySelector(".break-time-parent").style.display="none";
        var diff,
            minutes,
            seconds;
        let workTime=workduration;
        let breakTime=breakduration;
        function timer() {
            if(canstart){
                // get the number of seconds that have elapsed since 
                // startTimer() was called
                diff=!workTimerFinish?workduration--:breakduration--;
                percent =!workTimerFinish?(diff/workTime)*100:(diff/breakTime)*100;
                radialProgress(percent);
                // does the same job as parseInt truncates the float
                hours = ((diff /3600)%24)|0;
                minutes = ((diff / 60)-hours*60) | 0;
                seconds = (diff % 60) | 0;

                hours = hours < 10 ? "0" + hours : hours;
                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;
        
                display.textContent = hours + ":" +minutes + ":" + seconds; 
        
                if (diff <= 0) {
                    if(!workTimerFinish){
                        workTimerFinish=true;
                        //sets the string of Time remaining to remaining break
                        document.querySelector(".time-remaining").textContent="Remaining Break";
                        // all the things for break time goes here
                        progressCircle.classList.remove("over50");
                        audio.play();

                    }else if(!breakTimerFinish){
                        breakTimerFinish=false;
                        workTimerFinish=false;
                        canstart=false;
                        progressCircle.classList.remove("over50");
                        document.querySelector(".time-remaining").textContent="Time Remaining:";
                        document.querySelector(".time-remaining").style.display="none";
                        document.querySelector(".button-container").style.display="none";
                        document.querySelector(".break-time-parent").style.display="block";
                        audio.play();
                    }
                }
            };
        }
        // we don't want to wait a full second before the timer starts
        timer();
        timerInterval = setInterval(timer, 1000);
    }

    function radialProgress(percent){
        console.log(percent);
        //100 means empty and 0 means full
        let wholePercent = percent | 0;
        if(wholePercent<50 &&!progressCircle.classList.contains("over50")){
            progressCircle.classList.add("over50");
        }
        progressCircle.classList.remove(previousPercentText);
        let newPercentText =`p${wholePercent}`;
        console.log(newPercentText);
        progressCircle.classList.add(newPercentText);
        previousPercentText=newPercentText;
        
    }
function pauseResume(){
   isPaused=!isPaused;
   if(isPaused){
       canstart=false;
       document.querySelector(".pause-resume").innerHTML=`<i class="fa fa-play" aria-hidden="true"></i>`;
   }else{
       canstart=true;
       document.querySelector(".pause-resume").innerHTML=`<i class="fa fa-pause" aria-hidden="true"></i>`;
   }
}
function ResetTimer(){
    clearInterval(timerInterval);
    document.getElementById("start").style.display="block";
    document.getElementById("clock-time").style.display="none";
    document.querySelector(".countdown").style.display="flex";
    document.querySelector(".time-remaining").style.display="none";
    document.querySelector(".button-container").style.display="none";
    document.querySelector(".break-time-parent").style.display="block";
    document.querySelector(".time-remaining").textContent="Time Remaining:";
    breakTimerFinish=false;
    workTimerFinish=false;
    audio.pause();
    audio.currentTime = 0;
    radialProgress(100);
}
 function buttonAddEventListener(){
        let hourUpArrow = getArrow("#up-arrow-hour");
        let hourDownArrow = getArrow("#down-arrow-hour");
        let minuteUpArrow = getArrow("#up-arrow-min");
        let minuteDownArrow = getArrow("#down-arrow-min");
        let secondUpArrow = getArrow("#up-arrow-sec");
        let secondDownArrow = getArrow("#down-arrow-sec");

        arrowEventListener(hourUpArrow,hour,+1);
        arrowEventListener(minuteUpArrow,minute,+1);
        arrowEventListener(secondUpArrow,second,+1);
        arrowEventListener(hourDownArrow,hour,-1);
        arrowEventListener(minuteDownArrow,minute,-1);
        arrowEventListener(secondDownArrow,second,-1);

        hourDiv.addEventListener("mouseover",function(){
            console.log("called");
            setOpacity(hourUpArrow,1);
            setOpacity(hourDownArrow,1);
        })
        hourDiv.addEventListener("mouseleave",function(){
            setOpacity(hourUpArrow,0);
            setOpacity(hourDownArrow,0);
        })

        minuteDiv.addEventListener("mouseover",function(){
            setOpacity(minuteUpArrow,1);
            setOpacity(minuteDownArrow,1);
        })
        minuteDiv.addEventListener("mouseleave",function(){
            setOpacity(minuteUpArrow,0);
            setOpacity(minuteDownArrow,0);
        })

        secondDiv.addEventListener("mouseover",function(){
            setOpacity(secondUpArrow,1);
            setOpacity(secondDownArrow,1);
        })
        secondDiv.addEventListener("mouseleave",function(){
            setOpacity(secondUpArrow,0);
            setOpacity(secondDownArrow,0);
        })
    }
}

function getArrow(str){
    return document.querySelector(str);
}
function setOpacity(ob,value){
    ob.style.opacity = String(value);
}

function arrowEventListener(arrow,timeHand,value){
    //adds the respective value when an arrow is clicked
    const hour =document.querySelector("#hour");
    const minute = document.querySelector("#minutes");
    const second = document.querySelector("#seconds");
    arrow.addEventListener("click",function(){
        let number = eval(timeHand.innerHTML);
        if(number==0 && value==-1){
            if(minute.innerHTML=="0"){
                 let number =eval(hour.innerHTML);
                 if(number!=0){
                     number--;
                     hour.innerHTML = number;
                 }
                 minute.innerHTML="60";
            }else if(second.innerHTML=="00"||second.innerHTML=="0"){
                second.innerHTML="60";
                let number =eval(minute.innerHTML);
                if(number!=0){
                    number--;
                    minute.innerHTML = number;
                }
                console.log("This is being called");
            }
            if(hour.innerHTML=="0"){
                return;
            }
        }else if(number==60 && value==1){
            if(minute.innerHTML=="60"){
                    let number =eval(hour.innerHTML);
                    number++;
                    hour.innerHTML = number;
                    minute.innerHTML="0";
            }else if(second.innerHTML=="60"){
                    let number =eval(minute.innerHTML);
                    number++;
                    minute.innerHTML = number;
                    second.innerHTML="00";
                    console.log(second.innerHTML);
            }
        } else{
            number +=value;
            timeHand.innerHTML=number;
        }

    })
}