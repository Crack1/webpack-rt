import gulp from 'gulp'
import webpack from 'webpack'
import chalk from 'chalk'
import rimraf from 'rimraf'
import {
  create as createServerConfig
} from './webpack.server'

const $ = require('gulp-load-plugins')()

/**
 * PUBLIC TASK
 */
gulp.task('clean:server', cb => rimraf('./build', cb))
gulp.task('clean:client', cb => rimraf('./public/build', cb))
gulp.task('clean', gulp.parallel('clean:server', 'clean:client'))
gulp.task('dev:server', gulp.series('clean:server', devServerBuild))
gulp.task('dev', gulp.series('clean', devServerBuild, gulp.parallel(devServerWatch, devSErverReload)))
gulp.task('prod:server', gulp.series('clean:server', prodServerBuild))

/**
 * PRIVATE SERVER TASKS
 */

const devServerWebpack = webpack(createServerConfig(true))
const prodServerWebpack = webpack(createServerConfig(false))

function devServerBuild(callback) {
  devServerWebpack.run((error, stats) => {
    outputWebpack('Dev:server', error, stats)
    callback()
  })
}


function devServerWatch() {
  devServerWebpack.watch({}, (error, stats) => {
    outputWebpack('Dev:server', error, stats)
  })
}

function devSErverReload() {
  return $.nodemon({
    script: './build/server.js',
    watch: './build',
    env: {
      NODE_ENV: 'development',
      USE_WEBPACK: true
    }
  })
}

function prodServerBuild(callback) {
  prodServerWebpack.run((error, stats) => {
    outputWebpack('Prod:server', error, stats)
    callback()
  })
}


/**
 * HELPERS
 */
function outputWebpack(label, error, stats) {
  if (error)
    throw new Error(error)
  if (stats.hasErrors()) {
    $.util.log(stats.toString({
      colors: true
    }))
  } else {
    const time = stats.endTime - stats.startTime
    $.util.log(chalk.bgGreen(`Built ${label} in ${time} ms`))
  }

}
