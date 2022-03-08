import * as React from 'react';
export class TestReact extends React.Component<any, any> {
  render() {
    return (
      <div>
        Hello world!It's from Helloword Component.
        <TestReact />
      </div>
    );
  }
}
