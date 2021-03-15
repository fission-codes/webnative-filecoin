// import * as ucanPermissions from 'webnative/ucan/permissions';

// const KeychainWnfsDirectory: string = "Keychain";

// // TODO: don't yet extend the permissions object; rather write the
// //       keys as an additional privatePaths
// // export type Permissions =
// //   ucanPermissions.Permissions &
// //   {
// //     keychain?: KeychainPermissions;
// //   };

// // export type KeychainPermissions = {
// //   keychainPaths: string[];};


// export const requestKeychainPermissions = (
//   nameParam: string,
//   creatorParam: string,
//   privatePathsParam: string[],
//   publicPathsParam: string[]
// ): ucanPermissions.Permissions => {
//   // add "floofs/private/Keychain/creator/name" as a private FS resource
//   const keychainPath = KeychainWnfsDirectory.concat(
//     creatorParam + '/' + nameParam);
//   privatePathsParam.push(keychainPath);
//   return {
//     app: {
//       name: nameParam,
//       creator: creatorParam
//     },
//     fs: {
//       privatePaths: privatePathsParam,
//       publicPaths: publicPathsParam
//     }
//   }
// }
