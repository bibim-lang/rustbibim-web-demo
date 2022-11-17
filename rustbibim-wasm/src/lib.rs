mod utils;

use std::sync::{Arc, Mutex};

use bibim::env::Env;
use bibim::run;

use js_sys::{self, Uint8Array};
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// #[wasm_bindgen]
// extern "C" {
//     #[wasm_bindgen(js_namespace = console)]
//     fn log(s: &str);
// }

#[wasm_bindgen]
pub fn run_code(
    code: String,
    on_read: &js_sys::Function,
    on_write: &js_sys::Function,
) -> Result<JsValue, JsValue> {
    utils::set_panic_hook();
    // log(code.as_str());
    let mut env = Env {
        cursor: None,
        mem: vec![],
        is_debug: true,
        on_read_io: Box::new(|| {
            Uint8Array::new(&on_read.call0(&JsValue::NULL).unwrap().clone()).to_vec()
        }),
        on_write_io: Box::new(|data: Vec<u8>| {
            // log(String::from_utf8(data.clone()).unwrap().as_str());
            on_write
                .call1(
                    &JsValue::NULL,
                    &JsValue::from(Uint8Array::from(data.as_slice())),
                )
                .ok();
        }),
    };
    let result = run(code, &mut env);
    match result {
        Ok(_) => Ok(JsValue::NULL),
        Err(e) => {
            let err_msg = format!("{}", e);
            // log(err_msg.clone().as_str());
            Err(JsValue::from_str(err_msg.as_str()))
        }
    }
}

#[wasm_bindgen]
pub fn simple_code_test() {
    utils::set_panic_hook();
    // code to test
    let code = r"{
        [1; !0]
    }";

    // setup env
    let input = "".as_bytes();
    let output = Arc::new(Mutex::new(Vec::new()));
    let mut env = Env {
        cursor: None,
        mem: vec![],
        is_debug: true,
        on_read_io: Box::new(|| input.to_vec()),
        on_write_io: Box::new(|data| output.lock().unwrap().extend(data)),
    };

    // run code
    run(code.to_string(), &mut env).unwrap();

    // test output
    assert_eq!(*output.lock().unwrap(), "".as_bytes());
}
