const fs = require('fs');
const fse = require('fs-extra');
const TarGz = require('tar.gz');
const ncp = require('ncp').ncp;

ncp('src/deployment', 'dist/mykola', {clobber:true}, err => {
  if (err) {
   return console.error(err);
  }

  // fake a maven local maven install for org.tomitribe.mykola:mykola:current to let it be easy to deploy
  const artifactVersion = 'current';
  const m2Base = process.env['HOME'] + '/.m2/repository/org/tomitribe/mykola/mykola/' + artifactVersion + '/';
  const out = m2Base + 'mykola-' + artifactVersion + '.tar.gz';
  fse.mkdirsSync(m2Base);

  new TarGz({}, {})
    .createReadStream('dist/mykola')
    .pipe(fs.createWriteStream(out));
});
