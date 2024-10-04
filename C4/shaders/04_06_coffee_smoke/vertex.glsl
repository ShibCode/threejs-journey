uniform float uTime;
uniform sampler2D uPerlinTexture;

varying vec2 vUv;

vec2 rotate2D(vec2 point, float angle) {
    float cosAngle = cos(angle);
    float sinAngle = sin(angle);

    mat2 rotationMatrix = mat2(cosAngle, -sinAngle, sinAngle, cosAngle);

    return rotationMatrix * point;
}

void main() {
    vec3 pos = position;

    float twistPerlin = texture(uPerlinTexture, vec2(0.5, uv.y * 0.2 - uTime * 0.005)).r;

    float angle = twistPerlin * 10.0;

    pos.xz = rotate2D(pos.xz, angle);

    vec2 windOffset = vec2(0, 0);
    windOffset.x = texture(uPerlinTexture, vec2(0.25, uTime * 0.01)).r - 0.5;
    windOffset.y = texture(uPerlinTexture, vec2(0.75, uTime * 0.01)).r - 0.5;
    windOffset *= 10.0 * pow(uv.y, 2.0);

    pos.xz += windOffset;

    // Final Position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    vUv = uv;
}