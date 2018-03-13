#version 330 compatibility

uniform vec4 uOceanColor;
uniform vec4 uMountainColor;

in float vLightIntensity;
in vec3 vXYZ;
in vec2 vST;

//change from void to vec3
void
CalculateNormal( vec3 x1, vec3 xm1, vec3 y1, vec3 ym1 , vec3 normal)
{
      
}

void
main( )
{
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
		newColor = vec3( r*2. - mod((g* greenery), 1.)/7., mod((g* greenery), 1.)/7., b);
		
	if(dist <= 1.){
		newColor = blueColor;
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