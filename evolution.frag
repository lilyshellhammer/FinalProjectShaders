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
	/*   CREATE SIN WAVES TO APPLY TO OCEAN   */
	//---------------------------		
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
	/* GREENERY BASED ON HEIGHT */
	//----------------------------
		//if above a certain altitute, start increasing the green value
		float greenery = 2 - dist;
		if(greenery <= 0.)
			greenery = 0.;
		newColor = vec3( r*2. - mod((g* greenery), 1.)/6., mod((g* greenery), 1.)/6., b);
		
	//---------------------------
	/* COLOR BASED ON HEIGHT */
	//---------------------------
	if(dist <= 1.){
		newColor = blueColor;
		newColor.b -= blue;		//blue and blue2 make "waves"
		newColor.b += blue2;
		if(newColor.b < 0.8)
			newColor.b = 1- 0.2*newColor.b;
		newColor *= vLightIntensity;
		gl_FragColor = vec4(newColor, 1.);
	}
	else if(dist > 1. && dist < 1.2){		//mix if between sea and mountains
		newColor = mix( newColor, blueColor, (1. - dist)*100);
		newColor *= vLightIntensity;
		gl_FragColor = vec4(newColor, 1.);
	}
	else{
		newColor *= vLightIntensity;	//else mountain color which is determined by height
		gl_FragColor = vec4(newColor, 1.);
	}

	
}