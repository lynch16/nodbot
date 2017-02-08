var csv = require('csv');
var fs = require('fs')
var five = require('johnny-five');
var BeagleBone = require('beaglebone-io');
var board = new five.Board({
  io: new BeagleBone()
});

//logger Setup (remember to run from root of git directory since using relative routes)
var gyroLogger= fs.createWriteStream('log/gyroData.txt', {
  flags: 'a'
});
var accLogger= fs.createWriteStream('log/accData.txt', {
  flags: 'a'
});

var led, imu, servos, distance, gyroInput, accInput;

board.on("ready", function() {

//Setup RGB LED (status indicator)
  led = new five.Led.RGB({
   pins: {
      red: "P9_21",
      green: "P9_14",
      blue: "P9_16"
   },
   isAnode: true
 });

//Setup IMU (motion detector)
  imu = new five.IMU({
     controller: "MPU6050",
   freq: 100
 });

//Setup drivetrain
  // servos = {};
  // servos.left = new five.Servo ({
  //   pin: "P8_13",
  //   type: "continuous"
  // });
  // servos.right = new five.Servo({
  //     pin: "P8_19",
  //     type: "continuous",
  //     invert: true
  // });
  // servos.both = new five.Servos([servos.left, servos.right]);

//Setup distance sensors
  // distance = {};
  // distance.irRight = new five.Proximity({
  //   controller: "GP2Y0A21YK",
  //   pin: "P9_39"
  // });
  // distance.irLeft = new five.Proximity({
  //   controller: "GP2Y0A21YK",
  //   pin: "P9_40"
  // });

  // distance.usProx = new five.Proximity({
  //   controller: "HC-SR04",
  //   pin: "__" //need to set pin
  // });

//After setup, status: green (good)
  led.on();
  led.color("green");

  // drive();
  logIMU();

  // distance.irRight.on("data", function(){
  //   console.log("Right: " + distance.irRight.cm);
  // });

  // distance.irLeft.on("data", function(){
  //   console.log("Left: " + distance.irLeft.cm);
  // });

  // this.repl.inject({
  //   servos: servos,
  //   anode: anode,
  //   imu: imu
  // });

});//End ready

function drive() {
  servos.both.cw();
  board.wait(3000, function(){
    servos.both.stop();
  });
}

function logIMU(){
  var count = 0;
  imu.on("data", function(){
    gyroInput += this.gyro.x + "," + this.gyro.y  + "," + this.gyro.z + "," + Date.now() + "\n"
    accInput += this.accelerometer.x + "," + this.accelerometer.y + "," +  this.accelerometer.z + "," +  this.accelerometer.pitch + "," +  this.accelerometer.roll + "," +  this.accelerometer.acceleration + "," +  this.accelerometer.inclination + "," +  this.accelerometer.orientation + "," + Date.now() + "\n"
    gyroLogger.write(gyroInput);
    accLogger.write(accInput);
    count ++
    if (count === 10000){
      led.color("blue");
      logger.end();
      board.emit("exit")
    }
  });
}

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
