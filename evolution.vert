#version 330 compatibility

uniform float uNoiseFreq;
uniform sampler2D Noise2;
uniform float uNoiseAmp;
uniform bool uGrowth;

out float vLightIntensity;
out vec2 vST;
out vec3 vXYZ;

uniform float Timer;
out float Time;

void
main( )
{ 
	//------------------------------------
	/* GET S, T, X, Y, Z , TIME, SEND OUT NOISE VARS*/
	//------------------------------------
		vST = gl_MultiTexCoord0.st;
		vXYZ = gl_Vertex.xyz;
		Time = Timer;

	//------------------------------------
	/* TEXTURE*/
	//------------------------------------
		/***Add texture values for Mountains (big changes), mult by magnitue of time****/
		vec4 nvx = texture( Noise2, uNoiseFreq *vST );
		float mountainVal = nvx.r + nvx.g + nvx.b + nvx.a  -  2.; //value from 0-1
		mountainVal *= uNoiseAmp;
	//	if(uGrowth == 1)
			mountainVal *= sin(Timer/10. * 2. * 3.14159);
		//else
		//	mountainVal = 0;

		
		if(mountainVal <= 0) {
			vXYZ = vXYZ;
		}
		else{
			vXYZ *= (1.+ mountainVal);
		}


	//------------------------------------
	/* FAKE LIGHTING */
	//------------------------------------
		vec3 tnorm = normalize( gl_NormalMatrix * gl_Normal );
		vec3 LightPos = vec3( 5., 10., 10. );
		vec3 ECposition = vec3( gl_ModelViewMatrix * gl_Vertex );
			vLightIntensity  = abs( dot( normalize(LightPos - ECposition), tnorm ) );
		if( vLightIntensity < 0.2 )
			vLightIntensity = 0.2;
		
	
	//------------------------------------
	/* SET FINAL VALUES */
	//------------------------------------
	vec4 newVertices = vec4(vXYZ, 1.);
	gl_Position = gl_ModelViewProjectionMatrix * newVertices;
}