// import scss from 'rollup-plugin-scss';
import clear from 'rollup-plugin-clear';
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import htmlTemplate from 'rollup-plugin-generate-html-template';
// import postcss from 'rollup-plugin-postcss';
import sourcemaps from 'rollup-plugin-sourcemaps';
import json from 'rollup-plugin-json';
const isDev = process.env.NODE_ENV !== 'production';//是否是开发环境
export default{
	input: ['./src/index.jsx'],
	output: {
		name:'yeditor',
		sourcemap:true,
		file: 'dist/main.js',
		format: 'es'
	},
	context: 'null',
	moduleContext: 'null',
	plugins: [
		clear({
			targets: ['dist']
		}),
		nodeResolve({
			jsnext: true,
			main: true,
			browser: true,
		}),
		commonjs({
			include: ["node_modules/**"],
		}),
		replace({
			preventAssignment: true,
			'process.env.NODE_ENV': JSON.stringify('production') // 否则会报：process is not defined的错
		}),
		// postcss({
		// 	extensions: ['.css'], // 将scss解析成css
		// 	extract: true,
		// 	modules: true,
		// }),
		babel({
			babelHelpers:'runtime',
			'plugins':["@babel/plugin-transform-runtime"],
			exclude: 'node_modules/**', // 只编译源代码
		}), // 会自动读取babel的配置文件
		json({
			// 默认情况下将解析所有JSON文件,
			// 但您可以专门包含/排除文件
			include: 'node_modules/**',
			exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],
			// 对于 tree-shaking, 属性将声明为
			// 变量, 使用 `var` 或者 `const`
			preferConst: true, // 默认是 false
			// 为生成的默认导出指定缩进 —
			// 默认为 't'
			indent: '  ',
			// 忽略缩进并生成最小的代码
			compact: true, // 默认是 false
			// 为JSON对象的每个属性生成一个命名导出
			namedExports: true // 默认是 true
		}),
		isDev && sourcemaps(),
		terser(),
		isDev && serve('dist'),
		isDev && livereload('dist'), // 当src目录中的文件发生变化时，刷新页面
		isDev && htmlTemplate({
			template: 'public/index.html',
			target: 'dist/index.html',
		}),
	],
	external: [
		{
			includeDependencies: true,
		},
	], // 项目中引用的第三方库
	watch: {
		include: 'src/**',
		clearScreen: true
	}
}