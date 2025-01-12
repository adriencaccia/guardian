<div align="center">
  <h1>
    <br/>
    <br/>
    🛡
    <br />
    Guardian
    <br />
    <br />
  </h1>
  <sup>
    <br />
    <a href="https://www.npmjs.com/package/@kumo-by-theodo/guardian">
       <img src="https://img.shields.io/npm/v/@kumo-by-theodo/guardian.svg" alt="npm package" />
    </a>
    <a href="https://www.npmjs.com/package/@kumo-by-theodo/guardian">
      <img src="https://img.shields.io/npm/dm/@kumo-by-theodo/guardian.svg" alt="npm downloads" />
    </a>
  </sup>
  <br />
  <br />
  <p>
    <q>Just because you don't see something, doesn't mean it doesn't exist</q>
  </p>
   <p align="right"> Anonymous on Tumblr - 2012 </p>
   <br/>
  <p>
    <b>Guardian</b> is a tool that analyzes the configuration of your AWS resources against best practice rules. <br /><b>Guardian</b> solves problems before they occur, and optimizes your app’s performances and costs.
  </p>
</div>
<br />
<br />
<div align="center">
  <h2>One minute quick start 🚀</h2>
  <br />
  <pre>npx <a href="https://www.npmjs.com/package/@kumo-by-theodo/guardian">@kumo-by-theodo/guardian</a></pre>
    <img src="./docs/images/guardian-run.gif" style="width: 60%">
  <br />
  <br />
</div>
<br />
<div align="center">
  <h2>Install Guardian on your project and customize your experience 🔎</h2>
  <br />
  <pre>yarn add -D <a href="https://www.npmjs.com/package/@kumo-by-theodo/guardian">@kumo-by-theodo/guardian</a></pre>

  <p>Select the cloudformation stacks you want to check using -c option</p>
  <pre>yarn guardian -c {YOUR_AWS_STACK_NAME_1} {YOUR_AWS_STACK_NAME_2}</pre>

  <p>Filter the checked resources by tags using the -t option</p>
  <pre>yarn guardian -t Key={TAG_KEY},Value={TAG_VALUE}</pre>

  <p>Specify an AWS profile or an AWS region using -p and -r options</p>
  <pre>yarn guardian -p {YOUR_AWS_PROFILE} -c {YOUR_AWS_STACK_NAME} -r {YOUR_AWS_REGION}</pre>

  <p><a href="./docs/running-locally.md">📚 More information about local runs of Guardian</a></p>
  <br />
</div>
<br />
<div align="center">
  <h2>Run Guardian as a periodic check on your CI 📟</h2>
  <br />
  <p>The command you want to run in your pipeline is:</p>
  <pre>yarn guardian -p {YOUR_AWS_PROFILE} -c {YOUR_AWS_STACK_NAME} -r {YOUR_AWS_REGION}</pre>

  <p><i>Github actions, Circle CI, Gitlab CI configuration snippets coming soon 🚀</i></p>
  <br/>
  <p>⚠️ To make sure it properly works when executed by a pipeline runner:<br/>

- Ensure that the CI/CD runner has an AWS profile configured, with AdministratorAccess privileges.<br/>
- If the region is not configured for that profile, make sure to specify it using the -r flag in the command.<br/></p>
  <p><a href="./docs/running-in-ci.md">📚 More information about CI runs of Guardian</a></p>
</div>
<br />
<br />
<h2 align="center">Rules featured by Guardian 📏</h2>
<br />

- AWS Lambda:
  - [`Lambda: Use ARM64 architecture`](./docs/rules/use-arm.md): checks that you're using ARM64 architectures for your Lambda functions.
  - [`Lambda: No shared IAM roles`](./docs/rules/no-shared-iam-roles.md): checks that each one of your Lambda functions has its own IAM role.
  - [`Lambda: Limited amount of versions`](./docs/rules/limited-amount-of-versions.md): checks that you do not store all previous deployment versions for your Lambda functions.
  - [`Lambda: Specify failure destination to async functions`](./docs/rules/async-specify-failure-destination.md): checks that each one of your async Lambda functions has a failure destination.
  - [`Lambda: No identical code`](./docs/rules/no-identical-code.md): checks that each one of your Lambda functions has different code.
  - [`Lambda: Light bundle`](./docs/rules/light-bundle.md): checks that each one of your Lambda functions' bundles is reasonably small.
  - [`Lambda: No default memory`](./docs/rules/no-default-memory.md): checks that you have consciously configured your Lambda functions' memory size.
  - [`Lambda: Under maximum memory`](./docs/rules/under-max-memory.md): checks that each one of your Lambda functions' memory size is reasonably small.
  - [`Lambda: No maximum timeout`](./docs/rules/no-max-timeout.md): checks that your Lambda functions' timeout is not set at the maximum available.
- AWS S3:
  - [`S3: Use intelligent tiering`](./docs/rules/use-intelligent-tiering.md): checks that each one of S3 buckets has intelligent tiering enabled.

<br />
<br />
<div align="center">
  <h2>Learn more about Guardian 📰</h2>
  <br />
  <p>
  Guardian's core team has published articles explaining decisions and how to fix rules on your architecture. Check them out, to find out more:
    <ul align='left'>
      <li>
        <a href='https://dev.to/kumo/that-one-aws-lambda-hidden-configuration-that-will-make-you-a-hero-guardian-is-watching-over-you-5gi7'><b>That one AWS Lambda hidden configuration that will make you a Hero - Guardian is watching over you</b></a> by <a href='https://twitter.com/Gozinebgo'>Zineb</a>
      </li>
      <li>
        <a href='https://dev.to/kumo/aws-lambda-versions-time-to-clean-up-guardian-is-watching-over-you-jkd'><b>AWS Lambda Versions : Time to clean up! - Guardian is watching over you</b></a> by <a href='https://twitter.com/PierreChollet22'>Pierre</a>
      </li>
      <li>
        <a href='https://dev.to/kumo/aws-lambda-101-shave-that-bundle-down-48c7'><b>AWS Lambda 101: Shave That Bundle Down</b></a> by <a href='https://twitter.com/eloiatheodo'>Éloi</a>
      </li>
    </ul>
  </p>
</div>
<br />
<br />
<div align="center">
  <h2>Contributors ❤️</h2>
  <br />
  <a href="https://github.com/kumo-by-theodo/guardian/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=kumo-by-theodo/guardian" />
  </a>
  <br/>
  <br/>
  <h4>Your contributions are very welcome, feel free to add new rules to Guardian !</h4>
  <br />
  <br />
</div>
