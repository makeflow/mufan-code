if(1) {}

{
  if(1) {
    let a;
  }
  // A meaningless comment
  do{}while(1)
  ~~~~~~~~~~~~ [empty-line-around-statement]
  let a = 1;
  ~~~~~~~~~~ [empty-line-around-statement]
  if(1) {
  ~~~~~~~
    while(1){}
~~~~~~~~~~~~~~
  }
~~~ [empty-line-around-statement]
}
if (1) {
~~~~~~~~
}
~ [empty-line-around-statement]
if(2) {}
~~~~~~~~ [empty-line-around-statement]
function a() {
~~~~~~~~~~~~~~
}
~ [empty-line-around-statement]
class haha{
~~~~~~~~~~~
}
~ [empty-line-around-statement]

let a = 1;
function foo(arg: number): number;
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [empty-line-around-statement]
function foo(arg: string): void;
function foo(arg: string | number): void|number{

}
function test(): void {}
~~~~~~~~~~~~~~~~~~~~~~~~ [empty-line-around-statement]

class Test{
  test(){}
  a = 1;
  ~~~~~~ [empty-line-around-statement]
}

class Test{
  hello: string = '1';
  test(name: number): number;
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~ [empty-line-around-statement]
  test(name: string): void;
  test(name: string|number): void|number{
  }
}

if(1){
  {}
  let value = 1;
  ~~~~~~~~~~~~~~ [empty-line-around-statement]
}

if(1){
  let value = 1;
  {}
  ~~ [empty-line-around-statement]
}

if(1){
  {}
}
if(1){
~~~~~~
}else if(0){
~~~~~~~~~~~~
  alert('haha!');
~~~~~~~~~~~~~~~~~
}
~ [empty-line-around-statement]

const obj = {
    methodA(path){
    },
    methodB(name){
    ~~~~~~~~~~~~~~
    }
~~~~~ [empty-line-around-statement]
}

[empty-line-around-statement]: An empty line is expected before the statement.
===================================================================================
if(1) {}

{
  if(1) {
    let a;
  }

  // A meaningless comment
  do{}while(1)

  let a = 1;

  if(1) {
    while(1){}
  }
}

if (1) {
}

if(2) {}

function a() {
}

class haha{
}

let a = 1;

function foo(arg: number): number;
function foo(arg: string): void;
function foo(arg: string | number): void|number{

}

function test(): void {}

class Test{
  test(){}

  a = 1;
}

class Test{
  hello: string = '1';

  test(name: number): number;
  test(name: string): void;
  test(name: string|number): void|number{
  }
}

if(1){
  {}

  let value = 1;
}

if(1){
  let value = 1;

  {}
}

if(1){
  {}
}

if(1){
}else if(0){
  alert('haha!');
}

const obj = {
    methodA(path){
    },

    methodB(name){
    }
}