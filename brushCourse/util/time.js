/*
 * @Author: ytj 
 * @Date: 2018-07-23 14:30:55 
 * @Last Modified by: ytj
 * @Last Modified time: 2018-07-23 14:40:40
 */

 module.exports = {
     sleep(milliSeconds) {
         if (milliSeconds === undefined) {
            while (true) {}
         }
         const start = +new Date();
         while (+new Date() - start < milliSeconds) {}
     }
 }