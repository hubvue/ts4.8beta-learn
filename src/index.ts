// unknown 兼容任何类型，但是{} | null | undefined联合类型不兼容unknown类型
function testUnknown(x: unknown, y: {} | null | undefined) {
  x = y
  // y = x // error
}

// 交叉类型

type NonNull = NonNullable<null>
type NonUndefined = NonNullable<undefined>
type NonString = NonNullable<string>

// {} 与任何对象类型相交 会直接简化为该对象类型，例如 string & {} = string

type NewNonNullable<T> = T & {}

type NewNonNull = NewNonNullable<null>   //never
type NewNonUndefined = NewNonNullable<undefined>  //never
type NewNonString = NewNonNullable<string> // string


type X = NonNullable<string>
type Y = NonNullable<NonNullable<string>>

type XX = NewNonNullable<string>
type YY = NewNonNullable<NewNonNullable<string>>

// 在之前NonNullable嵌套是不兼容，4.8简化为该对象类型后是兼容的
function nonNullable<T>(x: NonNullable<T>, y: NonNullable<NonNullable<T>>) {
  x = y
  // y = x //不兼容
}

function newNonNullable<T>(x: NewNonNullable<T>, y: NewNonNullable<NewNonNullable<T>>) {
  x = y
  y = x 
}


function narrowUnknownIsUnion(x: {} | null | undefined) {
  if (x) {
    x; // {}
  } else {
    x; // {} | null | undefined
  }
}

// 在之前判断一个unknown类型为true时，仍然是unknown类型，3.8中unknown在true分支中缩小，推断为{}类型
function narrowUnknown(x: unknown) {
  if (x) {
    x;  // 之前是 unknown, 现在是{}
  } else {
    x;  // unknown
  }
}

function throwIfNullable<T>(value: T): NewNonNullable<T> {
  if (value === undefined || value === null) {
    throw Error("Nullable value!")
  }
  return value
}

var a = throwIfNullable(null)
var a = throwIfNullable(undefined)
var b = throwIfNullable(123)


type TryGetNumberIfFirst<T> = T extends [infer U extends number, ...unknown[]] ? U : never

type TGN = TryGetNumberIfFirst<["123", 2, 3]>


//  字符串infer推断
type SomeNum = "100" extends `${infer U extends number}` ? U : never; // 100
type SomeBigInt = "100" extends `${infer U extends bigint}` ? U : never; // 100n
type SomeBool = "true" extends `${infer U extends boolean}` ? U : never; // true

// 这里 JustNumber 是 `number` 因为 TypeScript 解析出 `"1.0"`，但是 `String(Number("1.0"))` 是 `"1"` 并且不匹配。
type JustNumber = "1.0" extends `${infer T extends number}` ? T : never; 
