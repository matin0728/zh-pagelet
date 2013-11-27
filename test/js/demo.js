
function stack_make_stack() {
    return null
}
function stack_push(stack, x) {
    return {
        top : function() { return x },
        pop : function() { return stack }
    }
}
function stack_top(stack) {
    return stack.top()
}
function stack_pop(stack) {
    return stack.pop()
}