const importComponents = import.meta.glob("./**/*.vue");

/*
Register Global or Common Components Dynamically in Vue 3
*/
export const registerComponents = async app => {
  for (const fileName of Object.keys(importComponents)) {
    const componentConfig = await importComponents[fileName]();
    const componentName = fileName
      .split("/")
      .pop()
      ?.replace(/\.\w+$/, "");

    app.component(componentName, componentConfig?.default);
  }
};
