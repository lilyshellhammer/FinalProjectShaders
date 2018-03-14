#version 330 compatibility

in float vLightIntensity;
in vec3 vXYZ;
in vec2 vST;

in float Time;

void
main( )
{
	vec4 uOceanColor = vec4(0.1, 1., 0.5, 1.);  
	vec4 uMountainColor = vec4(0.1, 0.7, 0.5, 1.);
	//---------------------------
	/*   CREATE NOISE TO APPLY TO OCEAN   */
	//---------------------------
	/*
	vec4 nvx = texture( Noise2, uNoiseFreq*vST );
	float blue = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;
	blue *= .3*uNoiseAmp;
    vec4 nvy = texture( Noise2, uNoiseFreq*vec2(vST.s,vST.t+0.5) );
	float green = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;
	green *= .3*uNoiseAmp;
	*/
		
	float s = vST.s + Time/10.;
	float t = vST.t + Time/10.;
	float blue = sin(s*300.);
	float blue2 = sin(t*300.);
	
	vec3 newColor = uOceanColor.rbg;
	vec3 blueColor = vec3(0., 0., 1.);
	
	//----------------------------
	/* GET R, G, B */
	//----------------------------
		float r = uMountainColor.r;
		float g = uMountainColor.g;
		float b = uMountainColor.b;
	
	//Define height
	float dist = abs(sqrt(pow(vXYZ.x,2) + pow(vXYZ.y,2) + pow(vXYZ.z,2)));
	
	//----------------------------
	/* GREENERY */
	//----------------------------
		//if above a certain altitute, start increasing the green value
		float greenery = 2 - dist;
		if(greenery <= 0.)
			greenery = 0.;
		newColor = vec3( r*2. - mod((g* greenery), 1.)/6., mod((g* greenery), 1.)/6., b);
		
	if(dist <= 1.){
		newColor = blueColor;
		newColor.b -= blue;
		newColor.b += blue2;
		if(newColor.b < 0.8)
			newColor.b = 1- 0.2*newColor.b;
		newColor *= vLightIntensity;
		gl_FragColor = vec4(newColor, 1.);
	}
	else if(dist > 1. && dist < 1.2){
		newColor = mix( newColor, blueColor, (1. - dist)*100);
		newColor *= vLightIntensity;
		gl_FragColor = vec4(newColor, 1.);
	}
	else{
		newColor *= vLightIntensity;
		gl_FragColor = vec4(newColor, 1.);
	}

	
}