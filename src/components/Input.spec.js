import UsernameInput from './UsernameInput.vue';
import { render } from '@testing-library/vue';

it ('has is-invalid class added for input when the help is set', () => {
    const {container} = render(UsernameInput, {props: {help: "Error message"}});
    const input = container.querySelector("input");
    expect(input.classList).toContain("is-invalid")
});

it('has invalid-feedback class for span when help is set', () =>{
    const {container} = render(UsernameInput, {props: {help: "Error message"}});
    const span = container.querySelector("span");
    expect(span.classList).toContain("invalid-feedback")
});

it ('does not have is-invalid class added for input when the help is not set', () => {
    const {container} = render(UsernameInput);
    const input = container.querySelector("input");
    expect(input.classList).not.toContain("is-invalid")
});