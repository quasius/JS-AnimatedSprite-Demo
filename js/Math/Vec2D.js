/*
A class for representing a 2D vector of floats with many math functions.
Assumes positive y is "down"


METHODS:
Vec2D			Fully-specified constructor.
Copy			Returns a copy of this.
Set				Sets this Vec2D to the passed x and y values.
ApproxEqual		Static function that returns if v2d1's components are both within a small epsilon of v2d2's components
RoundThis		Rounds the values of this Vec2D to the nearest integer.
GetRound		Returns a new Vec2D that has both values rounded to the nearest integer
Magnitude		Returns the magnitude of this vector
MagnitudeSquared	Returns the square of the magnitude of this vector.  (Cheaper than actual magnitude and still useful for relative comparisons)
DotProduct		Returns the dot product of this and the passed vector
GetOrthogonalVector		Returns a vector orthogonal to this.  (2D analog of the 3D "cross product")
AngleBetweenVector	Finds the smallest angle in radians between this and the passed vector.  Always positive.
ClockwiseAngleToVector	Finds the angle in radians from this to the passed vector in the clockwise direction.  Will return "long way around" if appropriate.
GetAngleFromPositiveX	Returns the angle in radians of this vector from the positive x-axis.
DistanceToPoint		Returns the distance from this (treated as a point) to the passed Vec2d
DistanceToPointSquared	Returns the square of distance from this (treated as a point) to the passed 2D point.  (Faster than DistanceToPoint and still useful for relative comparisons)
InterpolateToVector		Returns a new vector linerally interpolated between this and the passed vector at the passed interpolation fraction.
ComponentWiseMultiply	Returns a vector that is (self.x * passed.x, self.y * passed.y)
ComponentWiseDivide		Returns a vector that is (self.x / passed.x, self.y / passed.y)
Add			Adds the passed vector to this and returns the result.  Does not modify this.
Sub			Subtracts the passed vector from this and returns the result.  Does not modify this.
Mult		Multiplies this by the passed scalar and returns the result.  Does not modify this.
Div			Divides this by the passed scalar and returns the result.  Does not modify this.
Negate		Returns the negation of this vector.  Does not modify this.
toString	Converts this vector to a string.


MEMBERS:
x		A floating point x-value
y		A floating point y-value

STATIC MEMBERS:
_v2dZero	A read-only zero-vector


DEPENDENCIES:
Math/GeneralMath.js
*/


//Fully-specified constructor.
function Vec2D(x, y)
{
	this.x = x;
	this.y = y;
}


//STATIC MEMBERS:
Vec2D._v2dZero = new Vec2D(0, 0);


//Returns a copy of this.
Vec2D.prototype.Copy = function()
{
	return new Vec2D(this.x, this.y);
}


//Sets this Vec2D to the passed x and y values.
Vec2D.prototype.Set = function(dX, dY)
{
	this.x = dX;
	this.y = dY;
}


//Static function that returns if v2d1's components are both within a small epsilon of v2d2's components
Vec2D.ApproxEqual = function(v2d1, v2d2)
{
	return (Math.abs(v2d1.x - v2d2.x) <= 0.000001 && Math.abs(v2d1.y - v2d2.y) <= 0.000001)
}


//Rounds the values of this Vec2D to the nearest integer.
Vec2D.prototype.RoundThis = function()
{
	this.x = Math.round(this.x);
	this.y = Math.round(this.y);
}

//Returns a new Vec2D that has both values rounded to the nearest integer
Vec2D.prototype.GetRound = function()
{
	return new Vec2D(Math.round(this.x), Math.round(this.y));
}


//Returns the magnitude of this vector
Vec2D.prototype.Magnitude = function()
{
	return Math.sqrt((this.x * this.x) + (this.y * this.y));
}

//Returns the square of the magnitude of this vector.  (Cheaper than actual magnitude and still useful for relative comparisons)
Vec2D.prototype.MagnitudeSquared = function()
{
	return (this.x * this.x) + (this.y * this.y);
}


//Returns the dot product of this and the passed vector
Vec2D.prototype.DotProduct = function(v2dOther)
{
	return (this.x * v2dOther.x) + (this.y * v2dOther.y);
}

//Returns a vector orthogonal to this.  (2D analog of the 3D "cross product")
//Returns the vector such that this is equivilent to rotating this (as a point) pi / 2 clockwise about the origin
Vec2D.prototype.GetOrthogonalVector = function()
{
	return new Vec2D(this.y, -this.x)
}


//Finds the smallest angle in radians between this and the passed vector.  Always positive.
//Either vector being 0-length is an error.
Vec2D.prototype.AngleBetweenVector = function(v2dOther)
{
	var dDotProduct = this.DotProduct(v2dOther);
	var dMagnitudesProduct = this.Magnitude() * v2dOther.Magnitude();
		
	return Math.acos(dDotProduct / dMagnitudesProduct);
}


//Finds the angle in radians from this to the passed vector in the clockwise direction.  Will return "long way around" if appropriate.
//Clockwise is positive
//Returns a result from 0 to 2*pi
//Gives undefined results if magnitude of either vector is 0
Vec2D.prototype.ClockwiseAngleToVector = function(v2dOther)
{
	var dAngleFromPosXToThis = this.GetAngleFromPositiveX();
	var dAngleFromPosXToThat = v2dOther.GetAngleFromPositiveX();

	var dAngle = dAngleFromPosXToThis - dAngleFromPosXToThat;

	//Normalize result
	if (dAngle < 0.0)
		dAngle = dAngle + GeneralMath.d2Pi;
		
	return dAngle;
}


//Returns the angle in radians of this vector from the positive x-axis.
//Positive x-axis is 0 radians and positive rotation is clockwise.
//Returns a value from 0 to 2*pi
//Returns 0.0f if this vector has magnitude 0.
Vec2D.prototype.GetAngleFromPositiveX = function()
{
	//First get the angle between this and positive x.  (acos(dot / magnitudes product))
	var dMagnitude = this.Magnitude();
	
	//Make sure we have non-0 magnitude
	if (GeneralMath.ApproxEqual(dMagnitude, 0.0))
		return 0.0;

	//The dot product of this with (1.0f, 0.0f) is simply x and it's magnitude is 1
	var dAngle = Math.acos(this.x / dMagnitude);
	
	
	//If the vector is in the -y half we need to compliment the raw angle with 2*pi
	if (this.y > 0.0)
		dAngle = GeneralMath.d2Pi - dAngle;

	return dAngle;
}


//Returns the distance from this (treated as a point) to the passed Vec2d
Vec2D.prototype.DistanceToPoint = function(v2dPoint)
{
	return Math.sqrt(((v2dPoint.x - this.x) * (v2dPoint.x - this.x)) + ((v2dPoint.y - this.y) * (v2dPoint.y - this.y)));
}

//Returns the square of distance from this (treated as a point) to the passed 2D point.  (Faster than DistanceToPoint and still useful for relative comparisons)
Vec2D.prototype.DistanceToPointSquared = function(v2dPoint)
{
	return ((v2dPoint.x - this.x) * (v2dPoint.x - this.x)) + ((v2dPoint.y - this.y) * (v2dPoint.y - this.y));
}


//Returns a new vector linerally interpolated between this and the passed vector at the passed interpolation fraction.
Vec2D.prototype.InterpolateToVector = function(v2dOther, dInterpolationFraction)
{
	return this.Add(v2dOther.Sub(this).Mult(dInterpolationFraction));
}


//Returns a vector that is (self.x * passed.x, self.y * passed.y)
Vec2D.prototype.ComponentWiseMultiply = function(v2dOther)
{
	return new Vec2D(this.x * v2dOther.x, this.y * v2dOther.y);
}

//Returns a vector that is (self.x / passed.x, self.y / passed.y)
Vec2D.prototype.ComponentWiseDivide = function(v2dOther)
{
	return new Vec2D(this.x / v2dOther.x, this.y / v2dOther.y);
}


//Adds the passed vector to this and returns the result.  Does not modify this.
Vec2D.prototype.Add = function(v2dOther)
{
	return new Vec2D(this.x + v2dOther.x, this.y + v2dOther.y);
}

//Subtracts the passed vector from this and returns the result.  Does not modify this.
Vec2D.prototype.Sub = function(v2dOther)
{
	return new Vec2D(this.x - v2dOther.x, this.y - v2dOther.y);
}

//Multiplies this by the passed scalar and returns the result.  Does not modify this.
Vec2D.prototype.Mult = function(dScalar)
{
	return new Vec2D(this.x * dScalar, this.y * dScalar);
}

//Divides this by the passed scalar and returns the result.  Does not modify this.
Vec2D.prototype.Div = function(dScalar)
{	
	return new Vec2D(this.x / dScalar, this.y / dScalar);
}

//Returns the negation of this vector.  Does not modify this.
Vec2D.prototype.Negate = function()
{
	return new Vec2D(-this.x, -this.y);
}


//Converts this vector to a string.
Vec2D.prototype.toString = function()
{
	return "(" + this.x + ", " + this.y + ")";
}
