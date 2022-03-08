import * as React from "react";
import { TestReact } from './TestComponent';
export class HelloWorld extends React.Component<any, any> {
  render() {
    return (
      <div>
        Hello world!It's from Helloword Component.
        <TestReact />
      </div>
    );
  }
}