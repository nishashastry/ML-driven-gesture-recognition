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


function setup(){ 

  //Because p5 is a drawing/creative library, it auto creates a canvas. Tells p5 to not create a canvas element
  noCanvas();

  //capture video stream from webcam
  video = createCapture(VIDEO);

  //puts video into div so it can display on the screen
  video.parent('video');


  //creates and initilized feature extractor
  //Here the concept of transfer learning is applied
  //featureExtractor() is a helper (class) of the ml5 library, used to reduce objects to categorizable features
  featureExtractor = ml5.featureExtractor('MobileNet'); //MobileNet is a lightweight model used for image classification. Mobile net is a pretrained model that already has the capabilities to classify an image by speififc categories.
  // we can apply MobileNet's learned features of an image and classify it as something new relevant to this program (transfer learning)
  classifier = featureExtractor.classification(video); //because I select mobile net as my model to extract features, i have access to classifiction(). creating a new classifier to classify images as a "red screen signal" or a "blue screen signal" using the features of mobile net to retrain the model with new data

  setupButtons();
}

function setupButtons(){
  //buttonR is when the button with id red is selected
  buttonR = select('#red');//sayig variable buttonR is the #red element,linking all the backend work of the button to the frontend html button element
  buttonB = select('#blue');

  buttonR.mousePressed(function() {

    //updates the count on the backend
      redCount++;

      //captures the frame and puts it under the classifier, adding a red label, for training
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
			
	// This is where we're actually training our model. the classifier is retraining the network using the pretrained features and the new data to fine-tune nuannces in the features its extracters in the new data
	//Goal: cost/loss value should be as small as possible
      if (lossValue) {
        loss = lossValue;
        select('#info').html('Loss: ' + loss); //display current loss value; will keep updating until close to zero
      } else {
        select('#info').html('Done Training! Final Loss: ' + loss); 
				select('#train').style("display", "none"); //hides train button
				select('#predict').style("display", "inline"); //shows this button
      }
    });
  });

    buttonPredict = select('#predict');
    buttonPredict.mousePressed(classify); //when predict button is pressed, call function to categorize the captured image
  
}

function classify(){
    classifier.classify(gotResults); //categorize the captured frame based on retrained model and then give the resukts to gotResults function
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
