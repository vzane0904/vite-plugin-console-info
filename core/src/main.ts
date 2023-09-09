import { Plugin } from 'vite'
import {traverse} from '@babel/core'
import {parse} from '@babel/parser'
import generate from '@babel/generator'
import * as t from '@babel/types';
import { Options } from './type'
export const vitePliginLog = (options:Options = {}):Plugin=>{
  console.log('options11',options);
  
  return {
    name:'',
    apply:'serve',
    config(){},
    transform(code,url){
      if(/^(?!.*\/node_modules\/).*\.(js|jsx|ts|tsx|vue)$/.test(url)){
        let address =url.slice( url.indexOf('src/'))
        
        let ast = parse(code,{
          sourceType:'module'
        })
        if(!ast)return
        traverse(ast,{
          CallExpression(path) {
            const callee = path.get('callee');
            const isLog =  callee.isMemberExpression() &&
            callee.get('object').isIdentifier({ name: 'console' }) &&
            callee.get('property').isIdentifier({ name: 'log' })
            if (isLog) {
              try {
                path.node.arguments.unshift(t.stringLiteral(`${address}=> `))
              } catch (error) {
                path.node.arguments = [t.stringLiteral(`${address}=> `)]
              }
            }
          }
        })
        
        const output = (generate as any).default(ast,{});
        return {
          code: output.code
        }
        
      }

    },
  }
}
export default vitePliginLog
