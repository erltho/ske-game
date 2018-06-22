# OpenShift Referanse React

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Initial setup

After cloning this project you should change both `name` and `groupId` in `package.json`.

Make sure to run these commands to configure npm to fetch packages from Aurora NPM repository.

```
npm config set strict-ssl false
npm config set always-auth false
npm config set registry https://nexus-npm.aurora.skead.no/npm/repository/npm-all
```

Install dependencies and start development

```
npm install
npm start
```

## Code Style

This project is configured with ESLint and Prettier. See `.eslintrc` for configuration details.

```
npm run lint        // Validate code style
npm run lint:fix    // Fix code style violations (use carefully)
```

## Configuration

See [Create React App User Guide](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md) for full list of configuration options.

#### Proxy

This project is configured to send every request starting with "/api" to the api server included in this project.
The included api server is set to default listen at port 9090.

#### STS-token

The project contains example use of the node module for obtaining and validating STS tokens (aurora-autentisering-rest-js). 
The examples are located inside server.js, in the form of three endpoints (/api/utsted, /api/tilgangsstyrt, /api/utstedogvalider).

The node module assumes the presence of certain environment variables. See the project README for details: https://git.aurora.skead.no/projects/AUF/repos/aurora-autentisering-rest-js/browse


## Testing

This project is using Jest and Enzyme for testing.

* [Jest](https://facebook.github.io/jest/)
* [Enzyme](https://github.com/airbnb/enzyme)
* [Enzyme-matchers](https://github.com/blainekasten/enzyme-matchers)

```
npm test                // Watch mode
npm run test:once       // Single run
npm run test:coverage   // Single run with coverage
```

## Jenkins

This project uses the same release logic as Leveransepakke. To release a new version you have to tag master with a new
tag in the form "vX.X.X" and then push your commit along with the tag. If your pushed commit does not contain a tag it
will create a new SNAPSHOT-release.

## Openshift

This reference application is ready to use on OpenShift. The application configuration for OpenShift is defined in
`metadata/openshift.json`.

#### The metadata/openshift.json - file

There are some parts of the openshift.json - file that are specific to Webleveransepakke:

```
....
   "web": {
        "configurableProxy": false,
        "nodejs": {
            "main": "api/server.js"
        },
        "webapp" {
           "content": "build",
           "path": "/",
           "disableTryfiles": false,
           "headers": {
              "SomeHeader": "SomeValue"
            }
        }
    }
....
```

The webapp-block is for configuring the static files.

#### web/webapp/content (**Required**)

| Type   | Default |
| ------ | ------- |
| string |         |

Specify where in the NPM-package the assets that should be served is placed.

#### web/webapp/headers

| Type   | Default |
| ------ | ------- |
| object |         |

Additional headers, such as "content-security-policy" for static files may be set with the "header"-block.

#### web/webapp/disableTryfiles

| Type    | Default |
| ------- | ------- |
| boolean | false   |

Since applications deployed with the Webleveransepakke normally is SPAs using the HTML5 History API, the Webserver is configured to use try_files
that will first try the path requested, then fall back to index.html. If this is not the wanted behaviour, "disableTryfiles" can be set to true.
If not set, or set to false, try_files will be enabled.

#### web/webapp/path

| Type   | Default |
| ------ | ------- |
| string | "/"     |

Sets the path for assets on the server. It defaults to "/" but some may want to have it under e.g "/web/app".

#### web/nodejs/main

| Type   | Default |
| ------ | ------- |
| string |         |

The nodejs block sets the patch to the main js file startet by node. If it not present, no backend server will be started.

#### web/configurableProxy

| Type    | Default |
| ------- | ------- |
| boolean | false   |

The configurableProxy will add a proxy pass configuration that may be controlled with the env variables "PROXY_PASS_HOST" and "PROXY_PASS_PORT".

**"PROXY_PASS_HOST" must be set to the hostname, without any protocol such as "http://"**.

```
PROXY_PASS_HOST=hostname
PROXY_PASS_PORT=8080
```

## AO and AuroraConfig

* AO (Aurora OpenShift Client) is used to deploy new application on OpenShift.
  Download latest [ao here](http://ao-aurora-tools.utv.paas.skead.no/).
* Use [AO](https://aurora/wiki/display/OS/Hvordan+ta+i+bruk+AO) to save AuroraConfig and deploy your new application.

Create an [AuroraConfig](https://aurora/wiki/display/OS/AuroraConfig) for this project. BaseFile example:

```
// filename: openshift-referanse-react.json
{
  "applicationPlatform": "web",
  "groupId" : "no.skatteetaten.aurora",
  "artifactId" : "openshift-referanse-react",
  "version": "1.0.0",
  "replicas" : 1,
  "route" : true
}
```

It is important that you specify `"applicationPlatform": "web"`, if this field is omitted the application will not start
correctly on OpenShift.

You should also change the groupId and artifactId in the AuroraConfig so they correspond to what is set in your package.json.

#### Development on OpenShift

For development we recomend setting `"type": "development"` in your AuroraConfig for this application. Doing so allows
you to send new development version directly to OpenShift with the command below.

`oc start-build <buildconfig> --from-file=<tgz>`, where `<buildconfig>` is the build config created by AO.

## ServiceWorker

The template this refapp is based on, registeres a service worker. We don't. If you know the implication of using service workers, feel
free to add it your self.
