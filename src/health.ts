/*
 * Copyright 2025 pyamsoft
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
import { newLogger } from "./bot/logger";

const logger = newLogger("HealthCheck");

const fireHealthCheck = function (url: string) {
  logger.log(`Attempt healthcheck: ${url}`);
  axios({
    method: "GET",
    url,
  })
    .then(() => {
      logger.log(`Healthcheck success!`);
    })
    .catch((e) => {
      logger.error(`Healthcheck failed!`, e);
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
