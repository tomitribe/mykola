const fs = require('fs');
const fse = require('fs-extra');
const archiver = require('archiver');

// fake a maven local maven install for org.tomitribe.mykola:mykola:current to let it be easy to deploy
const artifactVersion = 'current';
const m2Base = process.env['HOME'] + '/.m2/repository/org/tomitribe/mykola/mykola/' + artifactVersion + '/';
const out = m2Base + 'mykola-' + artifactVersion + '.war';
fse.mkdirsSync(m2Base);

const output = fs.createWriteStream(out);
const archive = archiver('zip', {});

output.on('finish', () => {
    console.log('war (' + out + ') ' + archive.pointer() + ' total bytes');
});

archive.pipe(output);
// weird, verbose and not maintenance friendly mapping but html5 mode is a mess for the backend,
// and we don't want to generate .class there
archive.append(`<?xml version="1.0" encoding="ISO-8859-1"?>
<web-app xmlns="http://java.sun.com/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="
          http://java.sun.com/xml/ns/javaee
          http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"
         version="3.0" metadata-complete="true">
    <servlet>
        <servlet-name>index</servlet-name>
        <jsp-file>/index.html</jsp-file>
    </servlet>

    <!-- resource mappings -->
` +
    ['*.eot', '*.svg', '*.woff', '*.woff2', '*.ttf', '*.js', '*.js.map', '/api/*'].map(m =>
    `   <servlet-mapping>
          <servlet-name>default</servlet-name>
          <url-pattern>` + m + `</url-pattern>
        </servlet-mapping>
`).join('\n') +
    '\n   <!-- html5 routing mapping -->\n' +
    ['/', '/tags', '/bulk-edit', '/dropdown', '/plus', '/sortable'].map(m =>
`   <servlet-mapping>
      <servlet-name>index</servlet-name>
      <url-pattern>` + m + `</url-pattern>
    </servlet-mapping>
`).join('\n') + `
</web-app>`, { name: 'WEB-INF/web.xml' });
archive.bulk([{ expand: true, cwd: 'dist/mykola', src: ['**'], dest: '/'}]);
archive.finalize();
