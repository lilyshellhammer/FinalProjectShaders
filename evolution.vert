#version 330 compatibility

uniform float uNoiseFreq;
uniform sampler2D Noise2;
uniform float uNoiseAmp;

out float vLightIntensity;
out vec2 vST;
out vec3 vXYZ;

uniform float Timer;

void
main( )
{ 
	//------------------------------------
	/* GET S, T, X, Y, Z , TIME*/
	//------------------------------------
		vST = gl_MultiTexCoord0.st;
		vXYZ = gl_Vertex.xyz;
		float x = vXYZ.x;
		float y = vXYZ.y;
		float z = vXYZ.z;
	
		//GET TIME!!!!!
	
	//------------------------------------
	/* TEXTURE*/
	//------------------------------------
		/***Add texture values for Mountains (big changes), mult by magnitue of time****/
		vec4 nvx = texture( Noise2, uNoiseFreq *vST );
		float mountainVal = nvx.r + nvx.g + nvx.b + nvx.a  -  2.; //value from 0-1
		mountainVal *= uNoiseAmp;
		mountainVal *= sin(Timer/10. * 2. * 3.14159);
		
		/***Add texture values for Oceans (small changes), mult by magnitue of time****/
		vec4 nvy = texture( Noise2, uNoiseFreq*vec2(vST.s,vST.t+0.5) );
		float oceanVal = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;	//value from 0-1
		oceanVal *= uNoiseAmp * 0.1;
		oceanVal *= sin(Timer/10.* 2. * 3.14159);

		
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