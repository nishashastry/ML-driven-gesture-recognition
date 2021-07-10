//variables
//featureExtractor and classifier are for the ML models
//viedo is webcam stream storage
//loss is porgress of how far the extractor has been trained
// counters are obv t count the number of images taken for training 
//feature extractor =  process by which an initial set of data is reduced by identifying key features of the data for machine learning.  

//p5.js is a creative library

// Declare Variables
var featureExtractor, classifier, video, loss, redCount, blueCount;

redCount = 0;
blueCount = 0;


function setup(){ ///hmmm..looks like the app didn' work when i wrote setUp but did when i wrote setup(), why is that?

  //Tells p5 to not create a canvas elements
  noCanvas();

  //capture video stream from webcam
  video = createCapture(VIDEO);

  //puts video into div so it can display on the screen
  video.parent('video');

 //creates and initilized feature extractor

  featureExtractor = ml5.featureExtractor('MobileNet'); // Mobile net = a machine learning model trained to recognize the content of certain images
  //featureExtractor() = allows you to extract features of an image via a pre-trained model and re-train that model with new data
  classifier = featureExtractor.classification(video); //because I select mobile net as my model to extract features, i have access to classifiction(). this uses the features of mobile net as a classifer

  setupButtons();
}

function setupButtons(){
  //buttonR is when the button with id red is selected
  buttonR = select('#red');//sayig variable buttonR is the #red element
  buttonB = select('#blue');

  //configuring counter
  buttonR.mousePressed(function() {

    //updates the count on the backend
      redCount++;

      //captures the frame and puts it under the classifier
      classifier.addImage('red');
  
  //updates the count visually on the screen
      select('#redCount').html(redCount);
  });


 buttonB.mousePressed(function() {

    //updates the count on the backend
      blueCount++;

      //captures the frame and puts it under the classifier
  classifier.addImage('blue');
  
  //updates the count visually on the screen
  select('#blueCount').html(blueCount);
  });

  train = select('#train'); ///var train is the train button
  train.mousePressed(function() { //when you press it
    classifier.train(function(lossValue) { //triggers this function
			
			// This is where we're actually training our model

      if (lossValue) {
        loss = lossValue;
        select('#info').html('Loss: ' + loss); //display loss value
      } else {
        select('#info').html('Done Training! Final Loss: ' + loss); 
				select('#train').style("display", "none"); //hides train button
				select('#predict').style("display", "inline"); //shows this button
      }
    });
  });

    buttonPredict = select('#predict');
    buttonPredict.mousePressed(classify); //when predict button is pressed, categorize the captured image
  
}

function classify(){
    classifier.classify(gotResults); //categorize the captured frame and then give the resukts to gotResults function
}

function gotResults(error, results){ // if there was an error when classifying, it gets passed here. if the classifier can recognize the contents of  the image (aka if the pic has define feature for red or blue)  then it gets passed into results
  if (error) {
    console.log(error);
  }
  var answer = Math.max(results[0].confidence, results[1].confidence);
  if(answer == results[0].confidence){
	  select("body").style("background", results[0].label); //makes the background red or blue accordingly
  }
  else{
	  select("body").style("background", results[1].label);
  }
  classify(); //infinte loop 

 
}