#version 330 compatibility

uniform float uNoiseFreq;
uniform sampler2D Noise2;
uniform float uNoiseAmp;

out float vLightIntensity;
out vec2 vST;
out vec3 vXYZ;

out vec3 Ns, Ls, Es;

uniform float Timer;
vec3 lightPos = vec3(0., 0., 0.);

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

	vec4 ECposition = gl_ModelViewMatrix * vec4(vXYZ, 1.);
	//------------------------------------
	/* LIGHTING */
	//------------------------------------
	
	Ns = normalize( gl_NormalMatrix * gl_Normal );
	Ls = lightPos - ECposition.xyz;	
	mat4 camera = inverse(gl_ModelViewMatrix);
	Es = camera[3].xyz;
	
	
	
	
	//------------------------------------
	/* SET FINAL VALUES */
	//------------------------------------
	vec4 newVertices = vec4(vXYZ, 1.);
	gl_Position = gl_ModelViewProjectionMatrix * newVertices;
}