#include <v8.h>
#include <nan.h>
#include <stdio.h>

using v8::Value;
using v8::Handle;
using v8::Object;
using v8::String;
using v8::FunctionTemplate;

void Stub(const Nan::FunctionCallbackInfo<v8::Value>& info) {
	Handle<Value>* argv = new Handle<Value>[info.Length()];

	for (int i = 0; i < info.Length(); i++)
		argv[i] = info[i];

	info.GetReturnValue().Set(Nan::MakeCallback(info.This(), info.Callee(), info.Length(), argv));

	delete[] argv;
}

void CreateStubFunction(const Nan::FunctionCallbackInfo<v8::Value>& info) {
	Nan::HandleScope scope;

	info.GetReturnValue().Set(Nan::GetFunction(Nan::New<FunctionTemplate>(Stub)).ToLocalChecked());
}

void Init(Handle<Object> target) {
	target->Set(Nan::New<String>("createStubFunction").ToLocalChecked(), Nan::GetFunction(Nan::New<FunctionTemplate>(CreateStubFunction)).ToLocalChecked());
}

NODE_MODULE(saphire, Init);

