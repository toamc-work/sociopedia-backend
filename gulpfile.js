import gulp from 'gulp'
import imagemin from 'gulp-imagemin'
import newer from 'gulp-newer'
import path from 'path'

gulp.task('images', () =>
    gulp.src('src/public/assets/**/*.{png,jpg,jpeg}') // Source path relative to gulpfile.js
        .pipe(newer({ dest: 'dist/public/assets', ext: '.+(png|jpg|jpeg)' })) // Only process newer images
        .pipe(imagemin()) // Optimize images (optional)
        .pipe(gulp.dest('dist/public/assets')) // Destination path relative to gulpfile.js
);

gulp.task('default', gulp.series('images'));