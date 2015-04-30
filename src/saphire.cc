#include <v8.h>
#include <nan.h>
#include <stdio.h>

using v8::Value;
using v8::Handle;
using v8::Object;
using v8::String;
using v8::FunctionTemplate;

NAN_METHOD(Stub) {
	Handle<Value>* argv = new Handle<Value>[args.Length()];

	for (int i = 0; i < args.Length(); i++)
		argv[i] = args[i];

	NanReturnValue(NanMakeCallback(args.This(), args.Callee(), args.Length(), argv));

	delete[] argv;
};

NAN_METHOD(CreateStubFunction) {
	NanScope();
	NanReturnValue(NanNew<FunctionTemplate>(Stub)->GetFunction());
};

void Init(Handle<Object> target) {
	target->Set(NanNew<String>("createStubFunction"), NanNew<FunctionTemplate>(CreateStubFunction)->GetFunction());
};

NODE_MODULE(saphire, Init);

