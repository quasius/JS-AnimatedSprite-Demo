//A simple example script that shows how to use the AnimatedSprite.js class.


//Will just init animation on 0'th frame
var flameSprite = new AnimatedSprite(ANIMDEFS.Flame, new Vec2D(50.0, 50.0));

//Create animation and start the "run_right" animation
var twilightSparkleSprite = new AnimatedSprite(ANIMDEFS.TwilightSparkle, new Vec2D(300.0, 200.0));
twilightSparkleSprite.PlayAnimation("run_right", AnimatedSprite.LOOP);



//On complete callback when burn one-shot animation stops
var OnCompleteBurnOneShot = function()
{
	alert("Burn one-shot animation completed.");
}


//Use jQuery to bind our buttons when the page loads.
$(document).ready(function($) {

//Bind burn one-shot button
$("#burn-one-shot").click(function()
{
	//Play the burn animation non-looped and specifying the optional OnComplete callback.
	flameSprite.PlayAnimation("burn", AnimatedSprite.ONE_SHOT, OnCompleteBurnOneShot);
});

//Bind burn one-shot-start-in-middle button
$("#burn-one-shot-middle").click(function()
{
	//Play the burn animation non-looped and specifying the optional OnComplete callback.
	flameSprite.PlayAnimation("burn", AnimatedSprite.ONE_SHOT, OnCompleteBurnOneShot);
	flameSprite.JumpToFrame(32);
});


//Bind twilight up button
$("#twilight-up").click(function()
{
	twilightSparkleSprite.PlayAnimation("run_up", AnimatedSprite.LOOP);
	$("#twilight-pause-play").html('Pause'); //Pause-play button is always pause after starting a new animation
});

//Bind twilight up-right button
$("#twilight-up-right").click(function()
{
	twilightSparkleSprite.PlayAnimation("run_up_right", AnimatedSprite.LOOP);
	$("#twilight-pause-play").html('Pause'); //Pause-play button is always pause after starting a new animation
});

//Bind twilight right button
$("#twilight-right").click(function()
{
	twilightSparkleSprite.PlayAnimation("run_right", AnimatedSprite.LOOP);
	$("#twilight-pause-play").html('Pause'); //Pause-play button is always pause after starting a new animation
});

//Bind twilight down-right button
$("#twilight-down-right").click(function()
{
	twilightSparkleSprite.PlayAnimation("run_down_right", AnimatedSprite.LOOP);
	$("#twilight-pause-play").html('Pause'); //Pause-play button is always pause after starting a new animation
});

//Bind twilight down button
$("#twilight-down").click(function()
{
	twilightSparkleSprite.PlayAnimation("run_down", AnimatedSprite.LOOP);
	$("#twilight-pause-play").html('Pause'); //Pause-play button is always pause after starting a new animation
});

//Bind twilight pause/play button
$("#twilight-pause-play").click(function()
{
	//Toggle pause / play
	var sButtonText = $(this).html();
	if (sButtonText == "Pause")
	{
		twilightSparkleSprite.PauseAnimation();
		$(this).html("Play");
	}
	else
	{
		twilightSparkleSprite.ResumeAnimation();
		$(this).html("Pause");
	}
});

//Bind twilight hide/show button
$("#twilight-hide-show").click(function()
{
	//Toggle hide / show
	var sButtonText = $(this).html();
	if (sButtonText == "Hide")
	{
		twilightSparkleSprite.SetVisible(false);
		$(this).html("Show");
	}
	else
	{
		twilightSparkleSprite.SetVisible(true);
		$(this).html("Hide");
	}
});

});


//Dispose
$(window).unload(function($) {
	//This actually isn't super-important here since we've leaving the page.
	//But if you ever want to stop using an animation while the page is still loaded, you must call "Dispose" or it will keep trying to update itself forever leaking CPU.
	flameSprite.Dispose();
	twilightSparkleSprite.Dispose();
});
