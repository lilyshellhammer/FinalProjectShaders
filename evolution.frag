#version 330 compatibility

uniform vec4 uOceanColor;
uniform vec4 uMountainColor;
uniform float uKa, uKd;

in float vLightIntensity;
in vec3 vXYZ;
in vec2 vST;
in vec3 Ns, Ls, Es;
float angx, angy;

uniform sampler2D Noise2;

vec3
RotateNormal( float angx, float angy, vec3 n )
{
        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y * cx - n.z * sx;    // y'
        n.z      =  n.y * sx + n.z * cx;    // z'
        n.y      =  yp;
        // n.x      =  n.x;

        // rotate about y:
        float xp =  n.x * cy + n.z * sy;    // x'
        n.z      = -n.x * sy + n.z * cy;    // z'
        n.x      =  xp;
        // n.y      =  n.y;

        return normalize( n );
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
		newColor = vec3( r*1.3 - mod((g* greenery), 1.)/7., mod((g* greenery), 1.)/7., b);
		
	//if not bump mapping
	angx = 0., angy = 0.;
	
	if(dist <= 1.){
		newColor = blueColor;
		newColor *= vLightIntensity;
	}
	else if(dist > 1. && dist < 1.2){
		newColor = mix( newColor, blueColor, (1. - dist)*100);
		newColor *= vLightIntensity;
	}
	else{
		newColor *= vLightIntensity;
		gl_FragColor = vec4(newColor, 1.);

		vec4 nvx = texture( Noise2, vST );
		float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;
		angx *= 1.;
		vec4 nvy = texture( Noise2, vec2(vST.s,vST.t+0.5) );
		float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;
		angy *= 1.;
		
	}
	
	vec3 Normal;
	vec3 Light;
	vec3 Eye;

	Normal = RotateNormal(angx, angy, Ns);
	Light = normalize(Ls);
	Eye = normalize(Es);
	
	vec4 ambient = uKa * vec4(newColor, 1.);

	float d = max( dot(Normal,Light), 0. );
	vec4 diffuse = uKd * d * vec4(newColor, 1.);

	gl_FragColor = vec4( ambient.rgb + diffuse.rgb, 1. );

	
}