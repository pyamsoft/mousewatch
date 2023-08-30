/*
 * Copyright 2023 pyamsoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import axios from "axios";

const fireHealthCheck = function (url: string) {
  axios({
    method: "GET",
    url,
  })
    .then(() => {
      // Ignore
    })
    .catch(() => {
      // Ignore
    });
};

export const registerPeriodicHealthCheck = function (url: string) {
  let timer: NodeJS.Timeout | undefined = undefined;

  if (url) {
    timer = setInterval(() => {
      fireHealthCheck(url);
    }, 60 * 1000);

    fireHealthCheck(url);
  }

  return {
    unregister: function () {
      if (timer) {
        clearInterval(timer);
        timer = undefined;
      }
    },
  };
};
