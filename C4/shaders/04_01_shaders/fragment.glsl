uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

void main() {
    vec4 fragColor = texture2D(uTexture, vUv);

    fragColor.rgb *= vElevation * 2.0 + 0.6;

    gl_FragColor = fragColor;
}