/*
A collection of common "static" math functions that don't fit into any class.

STATIC MEMBERS:
dDegreesToRadians		Conversion factor from degrees to radians
dRadiansToDegrees		Conversion factor from radians to degrees
d2Pi					2.0 * pi
dHalfPi					pi / 2.0


METHODS:
ApproxEqual		Returns if the 2 passed numbers are within a small epsilon of each other
ApproxGreaterOrEqual	Returns if dNumber1 is greater than or equal to dNumber2 within a small epsilon
ApproxLessOrEqual		Returns if dNumber1 is less than or equal to dNumber2 within a small epsilon
ApproxGreater			Returns if dNumber1 is greater than dNumber2 by at least a small epsilon
ApproxLess				Returns if dNumber1 is less than dNumber2 by at least a small epsilon
ApproxFloor		Returns the floor of the passed value unless it's only slightly less than an integer in which case, ceil is returned instead.
Round			Returns the passed number rounded to the nearest integer.  (x.5 rounds to x + 1).  (Duplicates functionality of JavaScript Math.round)
RoundToNearest	Returns the passed numbed rounded to the nearest dInterval with midpoints rounded up.  (RoundToNearest(3.6, 0.5) will return 3.5)
*/


var GeneralMath = {};


//Init static vars
GeneralMath.dDegreesToRadians = Math.PI / 180.0;
GeneralMath.dRadiansToDegrees = 180.0 / Math.PI;
GeneralMath.d2Pi = 2.0 * Math.PI;
GeneralMath.dHalfPi = Math.PI / 2.0;


//Returns if the 2 passed numbers are within a small epsilon of each other
GeneralMath.ApproxEqual = function(dNumber1, dNumber2)
{
	return (Math.abs(dNumber1 - dNumber2) <= 0.000001);
}


//Returns if dNumber1 is greater than or equal to dNumber2 within a small epsilon
GeneralMath.ApproxGreaterOrEqual = function(dNumber1, dNumber2)
{
	return (dNumber1 >= dNumber2 || Math.abs(dNumber1 - dNumber2) <= 0.000001);
}


//Returns if dNumber1 is less than or equal to dNumber2 within a small epsilon
GeneralMath.ApproxLessOrEqual = function(dNumber1, dNumber2)
{
	return (dNumber1 <= dNumber2 || Math.abs(dNumber1 - dNumber2) <= 0.000001)
}


//Returns if dNumber1 is greater than dNumber2 by at least a small epsilon
GeneralMath.ApproxGreater = function(dNumber1, dNumber2)
{
	return (dNumber1 - dNumber2 >= 0.000001)
}


//Returns if dNumber1 is less than dNumber2 by at least a small epsilon
GeneralMath.ApproxLess = function(dNumber1, dNumber2)
{
	return (dNumber1 - dNumber2 >= 0.000001)
}


//Returns the floor of the passed value unless it's only slightly less than an integer in which case, ceil is returned instead.
GeneralMath.ApproxFloor = function(dNumber)
{
	var dDistanceToInt = dNumber - Math.round(dNumber);
	if (dDistanceToInt >= -0.000001 && dDistanceToInt < 0.0)
		return Math.ceil(dNumber);
	
	return Math.floor(dNumber);
}

//Returns the passed number rounded to the nearest integer.  (x.5 rounds to x + 1).  (Duplicates functionality of JavaScript Math.round)
GeneralMath.Round = function(dNumber)
{
	var dRoundedNumber = Math.floor(dNumber);
	if (dNumber - dRoundedNumber >= 0.5)
		return dRoundedNumber + 1.0;

	return dRoundedNumber;
}


//Returns the passed numbed rounded to the nearest dInterval with midpoints rounded up.  (RoundToNearest(3.6, 0.5) will return 3.5)
GeneralMath.RoundToNearest = function(dNumber, dInterval)
{
	var dRemainder = dNumber % dInterval;

	//Start by rounding "down"
	var dRoundedNumber = dNumber - dRemainder;
	
	//If the remainder is at least half the interval, we need to round "up"
	if (Math.abs(dRemainder) >= dInterval / 2.0)
	{
		if (dNumber >= 0.0)
			dRoundedNumber = dRoundedNumber + dInterval;
		else
			dRoundedNumber = dRoundedNumber - dInterval;
	}
	
	return dRoundedNumber;
}

