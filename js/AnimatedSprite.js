//A class representing a self-updating animated sprite that uses CSS to go through a sprite sheet.
//
//
//PUBLIC METHODS:
//AnimationSprite	Constructs an AnimatedSprite from the passed sprite definition at the passed position.
//PlayAnimation		Plays the passed animation (either looping or now.)  Takes in an optional on-complete callback function.
//StopAnimation		Stops the currently _PLAYING animation (if any) and invokes _fpOnAnimationComplete if it exists and an animation was _PLAYING.
//PauseAnimation	Pauses the currently-_PLAYING animation (if any).
//JumpToFrame		Skips directly to the passed frame for the currently-_PLAYING or currently-_PAUSED animation.
//SetVisible		Shows or hides this AnimatedSprite
//Dispose			Destroys this AnimatedSprite and stops its self-updating.  Must be called when sprite is no longer needed.
//
//PUBLIC ENUMS:
//AnimationPlayType		Passed to PlayAnimation.  Can be AnimatedSprite.ONE_SHOT or AnimatedSprite.LOOP
//
//
//PRIVATE METHODS:
//_SetVisualFrame		Private function that actually sets the visual frame.
//
//PRIVATE MEMBERS:
//_animationDefinition		The animation definition for this AnimatedSprite
//_element					The HTML div element this AnimatedSprite lives in.  Created in constructor
//_nCurrentFrame			The current frame being displayed.  Ordering is left-to-right then top-to-bottom.  0-indexed. 
//_nAnimationState			The current state from the AnimationState enum.
//_nAnimationPlayType		The current type of animation being played from the AnimationPlayType enum
//_currentAnimation			The current animation being played.	 Null when an _nAnimationState is _STOPPED
//_dPrevUpdateTime			The absolute time of the last update in milliseconds.
//_dAnimationTimer			The timer into the current animation cycle in milliseconds.
//_updateInterval			Holds the recurring update function that is destroyed in Dispose.
//_fpOnAnimationComplete	The callback for when the current animation completes / stops.  Null if _nAnimationState is _STOPPED or no value was passed to PlayAnimation.




//Constructs an AnimatedSprite from the passed sprite definition at the passed position.
//Optional parent element parameter specifies DOM element that this will become a child of.  If undefined, this will become a child of the body root node.
function AnimatedSprite(animationDefinition, v2dPosition, parentElement)
{
	this._animationDefinition = animationDefinition;
	this._element = document.createElement("div");
	
	//Append new element to parent of body root
	if (parentElement === undefined)
		document.body.appendChild(this._element);
	else
		parentElement.appendChild(this._element);
	
	
	//Position and size element
	this._element.style.position = "absolute";
	this._element.style.left = v2dPosition.x + "px";
	this._element.style.top = v2dPosition.y + "px";
	this._element.style.width  = this._animationDefinition.frames.width + "px";
	this._element.style.height = this._animationDefinition.frames.height + "px";

	// Add image element source
	this._element.style.backgroundImage = "url(" + this._animationDefinition.image + ")";
	
	//Init other class members
	this._currentAnimation = null;
	this._dAnimationTimer = 0.0;
	this._fpOnAnimationComplete = null;		

	//Init to stopped at frame 0
	this._nCurrentFrame = 0;
	this._nAnimationState = AnimatedSprite._STOPPED;
	this._nAnimationPlayType = AnimatedSprite.ONE_SHOT;
	this._SetVisualFrame(0);
		
	
	//Begin periodic updates
	this._dPrevUpdateTime = Date.now();
	var self = this;
	this._updateInterval = setInterval(function(){self._Update()}, 60);
}

//AnimationPlayType enum
AnimatedSprite.ONE_SHOT = 0;
AnimatedSprite.LOOP = 1;

//AnimationState enum
AnimatedSprite._STOPPED = 0;
AnimatedSprite._PLAYING = 1;
AnimatedSprite._PAUSED = 2;




//Plays the passed animation (either looping or now.)  Takes in an optional on-complete callback function.
AnimatedSprite.prototype.PlayAnimation = function(sAnimationName, nAnimationPlayType, fpOnComplete)
{
	//If we are currently _PLAYING another animation with an OnComplete callback, invoke it
	if ((this._nAnimationState === AnimatedSprite._PLAYING || this._nAnimationState === AnimatedSprite._PAUSED) && this._fpOnAnimationComplete !== null)
		this._fpOnAnimationComplete();
	
	this._nCurrentFrame = 0;
	this._currentAnimation = this._animationDefinition.animations[sAnimationName];
	this._nAnimationState = AnimatedSprite._PLAYING;
	this._nAnimationPlayType = nAnimationPlayType;
	this._dAnimationTimer = 0.0;
	if (fpOnComplete !== undefined)
		this._fpOnAnimationComplete = fpOnComplete;
	else
		this._fpOnAnimationComplete = null;
}

//Stops the currently _PLAYING animation (if any) and invokes _fpOnAnimationComplete if it exists and an animation was _PLAYING. 
AnimatedSprite.prototype.StopAnimation = function()
{
	//Do nothing if already _STOPPED
	if (this._nAnimationState === AnimatedSprite._STOPPED)
		return;
		
	this._nAnimationState = AnimatedSprite._STOPPED;
	this._currentAnimation = null;
	
	//invoke the callback, if it exists
	if (this._fpOnAnimationComplete !== null)
	{
		this._fpOnAnimationComplete();
		this._fpOnAnimationComplete = null;
	}
}

//Pauses the currently-_PLAYING animation (if any).
AnimatedSprite.prototype.PauseAnimation = function()
{
	//Do nothing if we're not currently _PLAYING
	if (this._nAnimationState !== AnimatedSprite._PLAYING)
		return;
		
	this._nAnimationState = AnimatedSprite._PAUSED;
}

//Resumes the currently-_PAUSED animation (if any).
AnimatedSprite.prototype.ResumeAnimation = function()
{
	//Do nothing if we're not currently _PAUSED
	if (this._nAnimationState !== AnimatedSprite._PAUSED)
		return;
		
	this._nAnimationState = AnimatedSprite._PLAYING;
}


//Private function that updates this animation with the passed time step
AnimatedSprite.prototype._Update = function()
{
	//Do nothing if we're not currently _PLAYING
	if (this._nAnimationState !== AnimatedSprite._PLAYING)
		return;
	
	
	//Find the update time
	var CurrentTime = Date.now();
	var dDeltaT = CurrentTime - this._dPrevUpdateTime;
	this._dPrevUpdateTime = CurrentTime;

	//Limit excessive frame update from refocusing tab, or who-knows-what
	if (dDeltaT > 150.0)
		dDeltaT = 150.0;

	//Update timer
	this._dAnimationTimer += dDeltaT;

	
	//Find number of frames and leave if it's only 1.  (No need to update a static "animation.")  Also leave if negative, but that shouldn't happen.
	var nBeginFrame = this._currentAnimation.beginFrame;
	var nNumFramesMinus1 = this._currentAnimation.endFrame - nBeginFrame;
	if (nNumFramesMinus1 == 0)
		return;
	//If there are somehow less than 0 frames, send an error and exit immediately
	if (nNumFramesMinus1 < 0)
	{
		console.error("AnimatedSprite:Update- 0 or negative number of frames.  Animations must be at least 1 frame with positive non-zero frame durations.");
		return;
	}

	
	//See if we've reached the end of the animation
	var nUpdatedFrame = nBeginFrame + Math.floor(this._dAnimationTimer / this._animationDefinition.frames.duration);
	if (nUpdatedFrame > nNumFramesMinus1)
	{
		//Loop if needed
		if (this._nAnimationPlayType == AnimatedSprite.LOOP)
		{
			var dTotalAnimationTime = (nNumFramesMinus1 + 1) * this._animationDefinition.frames.duration;

			//If animation time is somehow ~0, send an error and exit immediately.  (Otherwise the while loop will be infinite.)
			if (dTotalAnimationTime < 0.01)
			{
				console.error("AnimatedSprite:Update- ~0 animation duration.  Animations must be at least 1 frame with positive non-zero frame durations.")
				return;
			}
			
			//Wrap the timer
			while (this._dAnimationTimer >= dTotalAnimationTime)
				this._dAnimationTimer -= dTotalAnimationTime;

			//Find new animation frame
			nUpdatedFrame = nBeginFrame + Math.floor(this._dAnimationTimer / this._animationDefinition.frames.duration);
		}
		//We're done if this was a one-shot
		else // (this._nAnimationPlayType == AnimatedSprite.ONE_SHOT)
		{
			//Make sure we end on the last frame
			nUpdatedFrame = nBeginFrame + nNumFramesMinus1;
			this.StopAnimation();
		}
	}
	
	
	//Update the frame if needed
	if (nUpdatedFrame !== this._nCurrentFrame)
		this._SetVisualFrame(nUpdatedFrame);
}


//Skips directly to the passed frame for the currently-_PLAYING or currently-_PAUSED animation.
AnimatedSprite.prototype.JumpToFrame = function(nFrame)
{
	//Do nothing if we're not currently _PLAYING or _PAUSED.
	if (this._nAnimationState !== AnimatedSprite._PLAYING && this._nAnimationState !== AnimatedSprite._PAUSED)
		return;

	//We need to set the timer to the beginning of the requested frame
	this._dAnimationTimer = nFrame * this._animationDefinition.frames.duration;
	
	this._SetVisualFrame(nFrame);
}


//Shows or hides this AnimatedSprite
AnimatedSprite.prototype.SetVisible = function(bVisible)
{
	this._element.style.visibility = bVisible ? "visible" : "hidden";
}

//Destroys this AnimatedSprite and stops its self-updating.  Must be called when sprite is no longer needed.
AnimatedSprite.prototype.Dispose = function()
{
	clearInterval(this._updateInterval);
	this._element.parentNode.removeChild(this._element);
}

//Private function that actually sets the visual frame.
AnimatedSprite.prototype._SetVisualFrame = function(nFrame)
{
	//Verify the bounds of the frame
	if ((this._nAnimationState === AnimatedSprite._STOPPED && nFrame < 0) ||
		(this._nAnimationState !== AnimatedSprite._STOPPED && (nFrame < this._currentAnimation.beginFrame || nFrame > this._currentAnimation.endFrame)))
	{
		console.error("AnimatedSpirte._SetVisualFrame- nFrame out of bounds");
		return;
	}
	
	
	//Find the clipping offset for this frame and apply it to the CSS
	var framesInfo = this._animationDefinition.frames;
	var v2dFrameGridPos = new Vec2D(nFrame % framesInfo.columns, Math.floor(nFrame / framesInfo.columns));
	var v2dClippingOffset = new Vec2D(-v2dFrameGridPos.x * framesInfo.width, -v2dFrameGridPos.y * framesInfo.height);
	this._element.style.backgroundPosition = v2dClippingOffset.x + "px" + " " + v2dClippingOffset.y + "px";

	//Set the internal frame num
	this._nCurrentFrame = nFrame;
}
