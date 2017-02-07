var csv = require('csv');
var fs = require('fs')
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
  // var servos = {};
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
  // var distance = {};
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

  // distance.irRight.on("data", function(){
  //   console.log("Right: " + distance.irRight.cm);
  // });

  // distance.irLeft.on("data", function(){
  //   console.log("Left: " + distance.irLeft.cm);
  //   console.log("Right: " + distance.irRight.cm);
  // });

  // for(var i = 0; i < 5; i++){
  //   drive();
  // }

  var count = 0;
  var gyroInput = ["X", "Y","Z","Pitch","Roll","Yaw","Rate"]
  var accInput = ["X", "Y","Z","Pitch","Roll","Acceleration","Inclination", "Orientation"]

  imu.on("data", function(){
    gyroInput += [this.gyro.x, this.gyro.y, this.gyro.z, this.gyro.pitch, this.gyro.roll, this.gyro.yaw, this.gyro.rate]
    accInput += [this.accelerometer.x, this.accelerometer.y, this.accelerometer.z, this.accelerometer.pitch, this.accelerometer.roll, this.accelerometer.acceleration, this.accelerometer.inclination, this.accelerometer.orientation]

    count ++; //crude  solution. Save every 100 rows to file
    if (count > 100){
      var d = new Date(milliseconds);
      csv.stringify(gyroInput, function(err, output){
        fs.writeFile("gyroData" + d + ".txt", output, function(err) {
          if(err) {
              return console.log(err);
          }
          console.log("The gyroData file was saved!");
        });
      });
      csv.stringify(accInput, function(err, output){
        fs.writeFile("accData" + d + ".txt", output, function(err) {
          if(err) {
              return console.log(err);
          }
          console.log("The accData file was saved!");
        });
      });
      count = 0; //reset count & inputs
      gyroInput = ["X", "Y","Z","Pitch","Roll","Yaw","Rate"];
      accInput = ["X", "Y","Z","Pitch","Roll","Acceleration","Inclination", "Orientation"];
      led.color("purple");
    }
  });

  // this.repl.inject({
  //   servos: servos,
  //   anode: anode,
  //   imu: imu
  // });
});//End ready

// function drive() {
//   servos.both.cw();
//   board.wait(3000, function(){
//     servos.both.stop();
//   });
// }

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
