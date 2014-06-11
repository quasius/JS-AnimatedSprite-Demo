//Use this object format for animation definitions.  (This is similar to, but not exactly what's used in HorizonsWeb.)
//(Animations do not have to be stored in a global object, but I just put them in ANIMDEFS for simplicity here.)

var ANIMDEFS = new Object();


//Hot
ANIMDEFS.Flame = {
	image: "Images/Flame512x720x8x8.png",
	animations: {"burn": {beginFrame: 0, endFrame: 63}},
	frames: {width: 64, height: 90, columns: 8, rows: 8, duration: 50}
};

//Magical
ANIMDEFS.TwilightSparkle = {
	image: "Images/TwilightSparkleAnim.png",
	animations: {"run_up": {beginFrame: 0, endFrame: 5},
				"run_up_right": {beginFrame: 6, endFrame: 11},
				"run_right": {beginFrame: 12, endFrame: 17},
				"run_down_right": {beginFrame: 18, endFrame: 23},
				"run_down": {beginFrame: 24, endFrame: 29}},
	frames: {width: 96, height: 96, columns: 10, rows: 3, duration: 100}
};
