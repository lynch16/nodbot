var five = require('johnny-five');
var BeagleBone = require('beaglebone-io');
var board = new five.Board({
  io: new BeagleBone()
});

board.on("ready", function() {

//Setup RGB LED (status indicator)
  var led = new five.Led.RGB({
   pins: {
      red: "P9_21",
      green: "P9_14",
      blue: "P9_16"
   },
   isAnode: true
 });

//Setup IMU (motion detector)
  var imu = new five.IMU({
     controller: "MPU6050",
   freq: 100
 });

//Setup drivetrain
  var servos = {};
  servos.left = new five.Servo ({
    pin: "P8_13",
    type: "continuous"
  });
  servos.right = new five.Servo({
      pin: "P8_19",
      type: "continuous",
      invert: true
  });
  servos.both = new five.Servos([servos.left, servos.right]);

//Setup distance sensors
  var distance = {};
  distance.irRight = new five.Proximity({
    controller: "GP2Y0A21YK",
    pin: "P9_39" 
  });
  distance.irLeft = new five.Proximity({
    controller: "GP2Y0A21YK",
    pin: "P9_40" 
  });

  // distance.usProx = new five.Proximity({
  //   controller: "HC-SR04",
  //   pin: "__" //need to set pin
  // });

//After setup, status: green (good)
  led.on();
  led.color("green");
  
  // distance.irRight.on("data", function(){
  //   console.log("Right: " + distance.irRight.cm);
  // });
  
  distance.irLeft.on("data", function(){
    console.log("Left: " + distance.irLeft.cm);
    console.log("Right: " + distance.irRight.cm);
  });
  
  servos.both.cw();
  this.wait(3000, function(){
    led.color("red");
  });
  
  imu.on("data", function(){
    console.log("Gyro: " + this.gyro.x + ", " + this.gyro.y)
    console.log("Acc: " + this.accelerometer.x + ", " + this.accelerometer.y)
  });

  // this.repl.inject({
  //   servos: servos,
  //   anode: anode,
  //   imu: imu
  // });
});//End ready


board.on("info", function(event){

});

board.on("warn", function(event){ //Send warning when emergency Proximity sensors hit

});

board.on("message", function(event){

})
//Catch errors generally
board.on("error", function(err) {
  console.log("There was an error" + err);
  return; //keep going after loging
});
