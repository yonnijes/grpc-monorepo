#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROTO_DIR = path.join(__dirname, 'src', 'proto');
const OUT_DIR = path.join(__dirname, 'src', 'generated');

// Limpiar y crear directorio de salida
if (fs.existsSync(OUT_DIR)) {
  fs.rmSync(OUT_DIR, { recursive: true });
}
fs.mkdirSync(OUT_DIR, { recursive: true });

const protoFiles = ['user.proto', 'product.proto'];

console.log('🔧 Generating TypeScript stubs from .proto files...');

protoFiles.forEach((file) => {
  const protoPath = path.join(PROTO_DIR, file);

  // Skip if file doesn't exist
  if (!fs.existsSync(protoPath)) {
    console.error(`❌ Proto file not found: ${protoPath}`);
    return;
  }

  try {
    // Determine path to node_modules relative to this script
    // Attempting to resolve protoc-gen-ts_proto path
    const pluginPath = path.resolve(__dirname, '../../node_modules/.bin/protoc-gen-ts_proto');

    execSync(
      `protoc --plugin=${pluginPath} --ts_proto_out=${OUT_DIR} --ts_proto_opt=nestJs=true --ts_proto_opt=addGrpcMetadata=true --ts_proto_opt=addNestjsRestParameter=true --ts_proto_opt=outputServices=grpc-js --proto_path=${PROTO_DIR} ${protoPath}`,
      {
        stdio: 'inherit',
        cwd: __dirname
      }
    );
    console.log(`✅ Generated stubs for ${file}`);
  } catch (error) {
    console.error(`❌ Error generating ${file}:`, error.message);
    // Try fallback to npx if direct protoc fails (assuming user has protoc installed globally or via some other means)
    try {
      console.log('Trying fallback to npx protoc...');
      execSync(
        `npx protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=${OUT_DIR} --ts_proto_opt=nestJs=true --ts_proto_opt=addGrpcMetadata=true --ts_proto_opt=addNestjsRestParameter=true --ts_proto_opt=outputServices=grpc-js --proto_path=${PROTO_DIR} ${protoPath}`,
        {
          stdio: 'inherit',
          cwd: __dirname
        }
      );
      console.log(`✅ Generated stubs for ${file} (fallback)`);

    } catch (e) {
      console.error(`❌ Fallback failed for ${file}:`, e.message);
    }
  }
});

console.log('✅ Proto generation completed!');
